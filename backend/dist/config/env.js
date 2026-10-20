"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().min(1).max(65535).default(3000),
    FRONTEND_ORIGIN: zod_1.z.string().default('http://localhost:5173'),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    const details = parsed.error.issues
        .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
    throw new Error(`Biến môi trường không hợp lệ:\n${details}`);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map