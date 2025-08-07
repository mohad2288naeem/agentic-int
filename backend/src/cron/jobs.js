const cron = require('node-cron');
const axios = require('axios'); // ← MISSING
const dayjs = require('dayjs');

const { supabase } = require('../services/supabase.service');

// Job to fetch scheduled calls every minute
// const fetchScheduledCallsJob = cron.schedule('*/1 * * * *', async () => {
//     console.log('🕒 Fetching scheduled calls...');

//     try {
//         const { data, error } = await supabase.from('scheduled_calls').select('*');

//         if (error) {
//             console.error('❌ Error fetching scheduled calls:', error.message);
//             return;
//         }

//         console.log('✅ Scheduled calls fetched successfully:');
//         console.log(data);

//     } catch (err) {
//         console.error('❌ An unexpected error occurred:', err.message);
//     }
// });


const fetchScheduledCallsJob = cron.schedule('*/1 * * * *', async () => {
    console.log('🕒 Fetching scheduled calls...');

    try {
        const { data, error } = await supabase
            .from('scheduled_calls')
            .select('*')
            .eq('status', 'scheduled');

        if (error) {
            console.error('❌ Error fetching scheduled calls:', error.message);
            return;
        }

        const now = dayjs();
        const currentDate = now.format('YYYY-MM-DD');
        const currentTime = now.format('HH:mm');

        console.log(`📅 Looking for calls scheduled at ${currentDate} ${currentTime}`);

        for (const call of data) {
            const interviewDate = call.interview_date;
            const interviewTime = dayjs(call.interview_time, 'HH:mm:ss').format('HH:mm');

            if (interviewDate === currentDate && interviewTime === currentTime) {
                console.log(`📞 Initiating call for scheduled_call_id: ${call.id}`);

                try {
                    await axios.post('http://localhost:5001/api/vapi/call', {
                        name: call.candidate_name || "User",
                        number: call.candidate_phone,
                        admin_id: call.admin_id,
                        scheduled_call_id: call.id
                    }, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log(`✅ Call API triggered for ${call.candidate_name}`);

                } catch (err) {
                    console.error(`❌ Failed to trigger call API for ${call.id}:`, err.response?.data || err.message);
                }
            }
        }

    } catch (err) {
        console.error('❌ An unexpected error occurred:', err.message);
    }
});


const pollCallStatus = async (callId, scheduledCallId) => {
    try {
        const response = await axios.get(`http://localhost:5001/api/vapi/call/${callId}`);

        const callData = response.data?.data;

        if (!callData) return;

        if (callData.status === "ended") {
            console.log("✅ Call has ended. Saving transcript and updating scheduled_calls...");

            // 1. Insert into transcribed_calls
            await supabase.from("transcribed_calls").insert([
                {
                    id: callId,
                    scheduled_call_id: scheduledCallId,
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
                    raw_data: callData
                }
            ]);

            // 2. Mark scheduled call as completed
            await supabase.from("scheduled_calls")
                .update({ call_status: "completed" })
                .eq("id", callId);

        } else {
            console.log("⏳ Call is not ended yet, will check again in next cycle.");
        }

    } catch (error) {
        console.error("❌ Error polling call status:", error?.response?.data || error.message);
    }
};



module.exports = {
    fetchScheduledCallsJob,
    pollCallStatus
}; 