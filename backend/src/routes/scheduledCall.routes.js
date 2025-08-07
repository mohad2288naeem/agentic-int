"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduledCall_controller_1 = require("../controllers/scheduledCall.controller");
const router = (0, express_1.Router)();
router.get('/', scheduledCall_controller_1.getScheduledCalls);
router.post('/', scheduledCall_controller_1.createScheduledCall);
exports.default = router;
