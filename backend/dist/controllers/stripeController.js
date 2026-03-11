"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeController = exports.StripeController = void 0;
const zod_1 = require("zod");
const crypto_1 = __importDefault(require("crypto"));
const stripe_1 = require("../lib/stripe");
const guideRepository_1 = require("../repositories/guideRepository");
const orderRepository_1 = require("../repositories/orderRepository");
const settingsService_1 = require("../services/settingsService");
const errorHandler_1 = require("../middleware/errorHandler");
const enums_1 = require("../generated/prisma/enums");
const env_1 = require("../config/env");
const createCheckoutSessionSchema = zod_1.z.object({
    guideId: zod_1.z.string().min(1),
    buyerName: zod_1.z.string().trim().min(1).max(255),
    buyerEmail: zod_1.z.string().trim().email(),
});
function buildAbsoluteUrl(base, pathAndQuery) {
    const url = new URL(base);
    const normalized = pathAndQuery.startsWith('/') ? pathAndQuery : `/${pathAndQuery}`;
    return new URL(normalized, url).toString();
}
class StripeController {
    constructor() {
        this.createCheckoutSession = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const input = createCheckoutSessionSchema.parse(req.body);
            const guide = await guideRepository_1.guideRepository.findById(input.guideId);
            if (!guide) {
                throw new errorHandler_1.ApiError(404, 'Guide not found');
            }
            if (!guide.stripePriceId) {
                throw new errorHandler_1.ApiError(400, 'This guide is not configured for Stripe checkout yet');
            }
            const settings = await settingsService_1.settingsService.getSettings();
            const now = new Date();
            const downloadExpiresAt = new Date(now.getTime() + settings.downloadExpiryHours * 60 * 60 * 1000);
            const downloadToken = crypto_1.default.randomUUID();
            const order = await orderRepository_1.orderRepository.create({
                customerName: input.buyerName,
                customerEmail: input.buyerEmail,
                guideId: guide.id,
                price: guide.price,
                paymentStatus: enums_1.PaymentStatus.PENDING,
                downloadToken,
                downloadExpiresAt,
                maxDownloads: settings.maxDownloads,
                paymentProvider: 'stripe',
                ipAddress: req.ip,
            });
            const successUrl = buildAbsoluteUrl(env_1.config.publicAppUrl, `/payment-success?order_id=${encodeURIComponent(order.id)}`);
            const cancelUrl = buildAbsoluteUrl(env_1.config.publicAppUrl, `/guides/${guide.id}`);
            const session = await stripe_1.stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                line_items: [
                    {
                        price: guide.stripePriceId,
                        quantity: 1,
                    },
                ],
                customer_email: input.buyerEmail,
                client_reference_id: order.id,
                metadata: {
                    orderId: order.id,
                    guideId: guide.id,
                },
                success_url: successUrl,
                cancel_url: cancelUrl,
            });
            await orderRepository_1.orderRepository.update(order.id, {
                paymentReference: session.id,
            });
            if (!session.url) {
                throw new errorHandler_1.ApiError(500, 'Stripe did not return a checkout URL');
            }
            res.json({
                success: true,
                data: { url: session.url, orderId: order.id },
            });
        });
        this.webhook = (0, errorHandler_1.asyncHandler)(async (req, res) => {
            const signature = req.headers['stripe-signature'];
            if (!signature || typeof signature !== 'string') {
                throw new errorHandler_1.ApiError(400, 'Missing Stripe signature');
            }
            const rawBody = req.body;
            let event;
            try {
                event = stripe_1.stripe.webhooks.constructEvent(rawBody, signature, env_1.config.stripeWebhookSecret);
            }
            catch (err) {
                throw new errorHandler_1.ApiError(400, err instanceof Error ? err.message : 'Invalid signature');
            }
            if (event.type === 'checkout.session.completed') {
                const session = event.data.object;
                const orderId = session.metadata?.orderId;
                if (!orderId) {
                    throw new errorHandler_1.ApiError(400, 'Missing orderId in session metadata');
                }
                const existing = await orderRepository_1.orderRepository.findById(orderId);
                if (existing && existing.paymentStatus !== enums_1.PaymentStatus.PAID) {
                    await orderRepository_1.orderRepository.update(orderId, {
                        paymentStatus: enums_1.PaymentStatus.PAID,
                        paymentReference: session.id,
                        paymentProvider: 'stripe',
                    });
                }
            }
            // Always acknowledge receipt so Stripe doesn't keep retrying.
            res.json({ received: true });
        });
    }
}
exports.StripeController = StripeController;
exports.stripeController = new StripeController();
//# sourceMappingURL=stripeController.js.map