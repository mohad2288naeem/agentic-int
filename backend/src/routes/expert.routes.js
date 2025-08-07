"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const expert_controller_1 = require("../controllers/expert.controller");
const router = (0, express_1.Router)();
router.get('/', expert_controller_1.getExperts);
router.post('/', expert_controller_1.createExpert);
exports.default = router;
