"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScheduledCall = exports.getScheduledCalls = void 0;
const supabase_service_1 = require("../services/supabase.service");
const getScheduledCalls = async (req, res) => {
    const { data, error } = await supabase_service_1.supabase.from('scheduled_calls').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getScheduledCalls = getScheduledCalls;
const createScheduledCall = async (req, res) => {
    const call = req.body;
    const { data, error } = await supabase_service_1.supabase.from('scheduled_calls').insert([call]).select().single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};
exports.createScheduledCall = createScheduledCall;
