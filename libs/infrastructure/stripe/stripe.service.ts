import Stripe from 'stripe';
import { IStripeService } from '../../application/interfaces/stripe-service.interface';
import { stripePlanDTO } from '../../shared/types/src';


export class StripeService  implements IStripeService{
  private stripe: Stripe;
  private webhookSecret: string;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRETE_KEY!, { apiVersion: '2025-06-30.basil' });
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string) {
    try {
      return this.stripe.webhooks.constructEvent(rawBody, signature, this.webhookSecret);
    } catch (err: any) {
      throw new Error(`Webhook signature verification failed: ${err.message}`);
    }
  }

  async parseCheckoutSession(sessionId: string): Promise<stripePlanDTO> {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items'],
    });

    const subscriptionId = session.subscription as string;
    const email = session.customer_details?.email

    let plan: 'premium' = 'premium';
    let period: 'monthly' | 'yearly' = 'monthly';
    let endDate = new Date();

    const items = session.line_items?.data || [];

    for (const item of items) {
      const priceId = item.price?.id;
      if (priceId === process.env.STRIPE_YEARLY_PRICE_ID) {
        period = 'yearly';
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else if (priceId === process.env.STRIPE_MONTHLY_PRICE_ID) {
        endDate.setMonth(endDate.getMonth() + 1);
      }
    }

    return {
      subscriptionId,
      plan,
      startDate: new Date(),
      endDate,
      period,
      email,
    };
  }

//   async handleInvoice(invoice: Stripe.Invoice) {
//     const email = invoice.customer_email;
//     const name = invoice.customer_name;
//     const url = invoice.hosted_invoice_url;
//     if (email && url && name) {
//     //todo : call the email service to send the invoice
//     }
//   }
}
