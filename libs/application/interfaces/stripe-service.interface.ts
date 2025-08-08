import Stripe from "stripe";
import { ChargeDTO, stripePlanDTO, SubscriptionDTO } from "../../shared/types/src";



export interface IStripeService {
    verifyWebhookSignature(rawBody: Buffer, signature: string): Stripe.Event,
    parseCheckoutSession(sessionId: string): Promise<stripePlanDTO>,
    getCharges(limit: number, startingAfter?: string): Promise<{
        charges: ChargeDTO[];
        hasMore: boolean;
        lastId: string | null;
    }>;
     getSubscriptions(limit: number, startingAfter?: string): Promise<{
        subscriptions: SubscriptionDTO[];
        hasMore: boolean;
        lastId: string | null;
     }>;
    getTotalRevenue(): Promise<Number>;

}