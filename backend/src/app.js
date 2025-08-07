"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const expert_routes_1 = __importDefault(require("./routes/expert.routes"));
const scheduledCall_routes_1 = __importDefault(require("./routes/scheduledCall.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const vapiRoutes = require('./routes/vapi.routes');

dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Agentic API backend!' });
});
app.use('/api/experts', expert_routes_1.default);
app.use('/api/scheduled-calls', scheduledCall_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/vapi', vapiRoutes);

// TODO: Add routes here
module.exports = app;
