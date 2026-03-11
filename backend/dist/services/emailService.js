"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailService = void 0;
const logger_1 = require("../config/logger");
class EmailService {
    async sendDownloadEmail(payload) {
        // Stub implementation: log to console / logger.
        // Replace with real email provider integration later.
        logger_1.logger.info(`Sending download email to ${payload.to} for ${payload.name}: ${payload.downloadUrl}`);
    }
}
exports.emailService = new EmailService();
//# sourceMappingURL=emailService.js.map