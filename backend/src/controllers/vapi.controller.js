const axios = require('axios');
const { supabase } = require('../services/supabase.service');
const { pollCallStatus } = require('../cron/jobs'); // ✅ ADD THIS

const VAPI_API_KEY = "d54b7858-f078-4b2e-9099-a47f0d46f86b";
const VAPI_ASSISTANT_ID = "56a8c116-17c9-4b86-b5f3-89045e58ff4c";
const VAPI_PHONE_NUMBER_ID = "3e749354-aedf-4088-8470-972f289fec66";

// const makeCall = async (req, res) => {
//     try {
//         const { name, number } = req.body;

//         if (!number) {
//             return res.status(400).json({ success: false, message: "Missing 'number' in body" });
//         }

//         console.log(`📞 Initiating call to ${name || "User"} at ${number}`);

//         const payload = {
//             phoneNumberId: VAPI_PHONE_NUMBER_ID,
//             assistantId: VAPI_ASSISTANT_ID,
//             customer: {
//                 name: name || "User",
//                 number
//             }
//         };

//         // ✅ FIXED ENDPOINT
//         const response = await axios.post('https://api.vapi.ai/call', payload, {
//             headers: {
//                 Authorization: `Bearer ${VAPI_API_KEY}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         console.log("✅ VAPI Call Queued:", response.data);
//         res.status(200).json({ success: true, data: response.data });

//     } catch (err) {
//         console.error("❌ VAPI Call Error:", err.response?.data || err.message);
//         res.status(500).json({
//             success: false,
//             error: err.response?.data || err.message
//         });
//     }
// };

// const makeCall = async (req, res) => {
//     try {
//         const { name, number, admin_id, scheduled_call_id } = req.body;

//         if (!number || !admin_id || !scheduled_call_id) {
//             return res.status(400).json({ success: false, message: "Missing 'number', 'admin_id', or 'scheduled_call_id'" });
//         }

//         console.log(`📞 Initiating call to ${name || "User"} at ${number}`);

//         const payload = {
//             phoneNumberId: VAPI_PHONE_NUMBER_ID,
//             assistantId: VAPI_ASSISTANT_ID,
//             customer: {
//                 name: name || "User",
//                 number
//             }
//         };

//         const response = await axios.post('https://api.vapi.ai/call', payload, {
//             headers: {
//                 Authorization: `Bearer ${VAPI_API_KEY}`,
//                 'Content-Type': 'application/json'
//             }
//         });

//         const callData = response.data;

//         // ✅ Insert call log into interview_logs
//         const { error: insertError } = await supabase.from('interview_logs').insert({
//             admin_id,
//             scheduled_call_id,
//             call_id: callData.id,
//             assistant_id: callData.assistantId,
//             phone_number_id: callData.phoneNumberId,
//             status: callData.status,
//             phone_call_provider: callData.phoneCallProvider,
//             phone_call_transport: callData.phoneCallTransport,
//             call_response: callData
//         });

//         await supabase
//         .from('scheduled_calls')
//         .update({ call_id: callData.id })
//         .eq('id', scheduled_call_id);

//         if (insertError) {
//             console.error("❌ Failed to save interview log:", insertError.message);
//         } else {
//             console.log("📝 Interview log saved.");
//         }

//         res.status(200).json({ success: true, data: callData });

//     } catch (err) {
//         console.error("❌ VAPI Call Error:", err.response?.data || err.message);
//         res.status(500).json({
//             success: false,
//             error: err.response?.data || err.message
//         });
//     }
// };



const makeCall = async (req, res) => {
    try {
        const { name, number, admin_id, scheduled_call_id } = req.body;

        if (!number || !admin_id || !scheduled_call_id) {
            return res.status(400).json({ success: false, message: "Missing 'number', 'admin_id', or 'scheduled_call_id'" });
        }

        console.log(`📞 Initiating call to ${name || "User"} at ${number}`);

        const payload = {
            phoneNumberId: VAPI_PHONE_NUMBER_ID,
            assistantId: VAPI_ASSISTANT_ID,
            customer: {
                name: name || "User",
                number
            }
        };

        const response = await axios.post('https://api.vapi.ai/call', payload, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const callData = response.data;

        // ✅ Save to interview_logs
        const { error: insertError } = await supabase.from('interview_logs').insert({
            admin_id,
            scheduled_call_id,
            call_id: callData.id,
            assistant_id: callData.assistantId,
            phone_number_id: callData.phoneNumberId,
            status: callData.status,
            phone_call_provider: callData.phoneCallProvider,
            phone_call_transport: callData.phoneCallTransport,
            call_response: callData
        });

        if (insertError) {
            console.error("❌ Failed to save interview log:", insertError.message);
        } else {
            console.log("📝 Interview log saved.");
        }

        // ✅ Update scheduled_calls with call_id
        await supabase
            .from('scheduled_calls')
            .update({ call_id: callData.id })
            .eq('id', scheduled_call_id);

        // ✅ Poll call status every 2 minutes (max 10 times)
        const intervalMs = 10 * 1000; // 10 seconds
        let retryCount = 0;
        const maxRetries = 10;

        const intervalId = setInterval(async () => {
            retryCount++;
            console.log(`🔁 Polling Vapi call status attempt ${retryCount} for call ${callData.id}`);

            await pollCallStatus(callData.id, scheduled_call_id);

            if (retryCount >= maxRetries) {
                console.log(`🛑 Stopping polling after ${retryCount} attempts`);
                clearInterval(intervalId);
            }
        }, intervalMs);

        res.status(200).json({ success: true, data: callData });

    } catch (err) {
        console.error("❌ VAPI Call Error:", err.response?.data || err.message);
        res.status(500).json({
            success: false,
            error: err.response?.data || err.message
        });
    }
};


const getCallDetails = async (req, res) => {
    const { callId } = req.params;

    if (!callId) {
        return res.status(400).json({ success: false, message: "Missing callId in URL" });
    }

    try {
        const response = await axios.get(`https://api.vapi.ai/call/${callId}`, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`
            }
        });

        console.log("📞 Call details fetched for:", callId);
        res.status(200).json({ success: true, data: response.data });

    } catch (err) {
        console.error("❌ Error fetching call details:", err.response?.data || err.message);
        res.status(500).json({ success: false, error: err.response?.data || err.message });
    }
};



const storeTranscript = async (req, res) => {
    const { call_id, scheduled_call_id } = req.body;

    if (!call_id || !scheduled_call_id) {
        return res.status(400).json({ success: false, message: "Missing call_id or scheduled_call_id" });
    }

    try {
        const response = await axios.get(`https://api.vapi.ai/call/${call_id}`, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
            },
        });

        const callData = response.data;

        const { error: insertError } = await supabase.from("transcribed_calls").insert([
            {
                id: call_id,
                scheduled_call_id,
                assistant_id: callData.assistantId,
                phone_number_id: callData.phoneNumberId,
                type: callData.type,
                created_at: callData.createdAt,
                updated_at: callData.updatedAt,
                started_at: callData.startedAt || null,
                ended_at: callData.endedAt || null,
                transcript: callData.transcript || "",
                recording_url: callData.recordingUrl || callData?.artifact?.recordingUrl || null,
                summary: callData.summary || callData?.analysis?.summary || null,
                status: callData.status,
                ended_reason: callData.endedReason || null,
                raw_data: callData,
            },
        ]);

        if (insertError) {
            console.error("❌ Failed to insert into transcribed_calls:", insertError.message);
            return res.status(500).json({ success: false, error: insertError.message });
        }

        return res.status(200).json({ success: true, message: "Transcript stored", data: callData });

    } catch (error) {
        console.error("❌ Error fetching Vapi call:", error.response?.data || error.message);
        return res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};




const fetchTranscriptsByAdmin = async (req, res) => {
    const { admin_id } = req.query;

    if (!admin_id) {
        return res.status(400).json({ success: false, message: "Missing admin_id in query" });
    }

    try {
        const { data, error } = await supabase
            .from("transcribed_calls")
            .select("*")
            .eq("admin_id", admin_id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error("❌ Error fetching transcripts:", error.message);
            return res.status(500).json({ success: false, error: error.message });
        }

        return res.status(200).json({ success: true, data });

    } catch (err) {
        console.error("❌ Unexpected error:", err.message);
        return res.status(500).json({ success: false, error: err.message });
    }
};

const createAssistant = async (req, res) => {
    try {
        const response = await axios.post('https://api.vapi.ai/assistant', req.body, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(201).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ VAPI Assistant Creation Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

const fetchAssistants = async (req, res) => {
    try {
        const response = await axios.get('https://api.vapi.ai/assistant', {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`
            }
        });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ VAPI Fetch Assistants Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

const fetchPhoneNumbers = async (req, res) => {
    try {
        const response = await axios.get('https://api.vapi.ai/phone-number', {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`
            }
        });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ VAPI Fetch Phone Numbers Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

const updatePhoneNumber = async (req, res) => {
    try {
        const { id } = req.params;
        const { assistantId } = req.body;

        const response = await axios.patch(`https://api.vapi.ai/phone-number/${id}`, {
            assistantId: assistantId
        }, {
            headers: {
                Authorization: `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        console.error("❌ VAPI Update Phone Number Error:", error.response?.data || error.message);
        res.status(500).json({ success: false, error: error.response?.data || error.message });
    }
};

module.exports = {
    makeCall,
    getCallDetails,
    storeTranscript,
    fetchTranscriptsByAdmin,
    createAssistant,
    fetchAssistants,
    fetchPhoneNumbers,
    updatePhoneNumber
};