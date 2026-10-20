"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const app = (0, app_1.createApp)();
const server = app.listen(env_1.env.PORT, () => {
    console.log(`Backend đang chạy tại http://localhost:${env_1.env.PORT} (${env_1.env.NODE_ENV})`);
});
function shutdown(signal) {
    console.log(`Nhận ${signal}, đang tắt server...`);
    server.close(() => process.exit(0));
}
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
//# sourceMappingURL=server.js.map