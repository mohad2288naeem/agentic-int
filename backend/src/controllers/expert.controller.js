"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExpert = exports.getExperts = void 0;
const supabase_service_1 = require("../services/supabase.service");
const getExperts = async (req, res) => {
    const { data, error } = await supabase_service_1.supabase.from('experts').select('*');
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getExperts = getExperts;
const createExpert = async (req, res) => {
    const { name, email, phone, specialty, location, status } = req.body;
    const { data, error } = await supabase_service_1.supabase.from('experts').insert([
        { name, email, phone, specialty, location, status: status || 'available' }
    ]).select().single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.status(201).json(data);
};
exports.createExpert = createExpert;
