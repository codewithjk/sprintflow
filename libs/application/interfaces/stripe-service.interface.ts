import Stripe from "stripe";
import { stripePlanDTO } from "../../shared/types/src";



export interface IStripeService {
    verifyWebhookSignature(rawBody: Buffer, signature: string): Stripe.Event,
    parseCheckoutSession(sessionId: string): Promise<stripePlanDTO>,
}