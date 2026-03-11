"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.settingsController = exports.SettingsController = void 0;
const zod_1 = require("zod");
const errorHandler_1 = require("../middleware/errorHandler");
const settingsService_1 = require("../services/settingsService");
const updateSettingsSchema = zod_1.z.object({
    downloadExpiryHours: zod_1.z.number().int().min(1).max(168).optional(),
    maxDownloads: zod_1.z.number().int().min(1).max(10).optional(),
    supportEmail: zod_1.z.string().email().optional(),
    currency: zod_1.z.string().min(1).max(10).optional(),
    paymentProvider: zod_1.z.string().optional().nullable(),
    paymentApiKey: zod_1.z.string().optional().nullable(),
});
class SettingsController {
    constructor() {
        this.get = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const settings = await settingsService_1.settingsService.getSettings();
            res.json({
                success: true,
                data: {
                    ...settings,
                    // Mask API key when sending to client
                    paymentApiKey: settings.paymentApiKey ? '****' : null,
                },
            });
        });
        this.update = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            if (!req.admin) {
                throw new errorHandler_1.ApiError(401, 'Not authenticated');
            }
            const parsed = updateSettingsSchema.parse(req.body);
            const updated = await settingsService_1.settingsService.updateSettings(parsed);
            res.json({
                success: true,
                data: {
                    ...updated,
                    paymentApiKey: updated.paymentApiKey ? '****' : null,
                },
            });
        });
    }
}
exports.SettingsController = SettingsController;
exports.settingsController = new SettingsController();
//# sourceMappingURL=settingsController.js.map