"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdmin = void 0;
const supabase_service_1 = require("../services/supabase.service");
const getAdmin = async (req, res) => {
    const { data, error } = await supabase_service_1.supabase.from('admin').select('*').limit(1).single();
    if (error)
        return res.status(500).json({ error: error.message });
    res.json(data);
};
exports.getAdmin = getAdmin;
