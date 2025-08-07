const express = require('express');
const router = express.Router();
const { makeCall, getCallDetails, storeTranscript, fetchTranscriptsByAdmin, createAssistant, fetchAssistants, fetchPhoneNumbers, updatePhoneNumber } = require('../controllers/vapi.controller');

router.post('/call', makeCall);
router.get('/call/:callId', getCallDetails);

router.post('/transcribe', storeTranscript); // ✅ New route
router.get('/transcripts', fetchTranscriptsByAdmin); // ✅ New route

router.post('/assistants', createAssistant); // ✅ New route for creating assistants
router.get('/assistants', fetchAssistants); // ✅ New route for fetching assistants

router.get('/phone-numbers', fetchPhoneNumbers); // ✅ New route for fetching phone numbers
router.patch('/phone-numbers/:id', updatePhoneNumber); // ✅ New route for updating phone numbers

module.exports = router;
