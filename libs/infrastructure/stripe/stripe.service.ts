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


  async getCharges(limit = 10, startingAfter?: string) {
  const params: Stripe.ChargeListParams = { limit };
  if (startingAfter) {
    params.starting_after = startingAfter;
  }

  const charges = await this.stripe.charges.list(params);

    console.dir(charges.data, { depth: null, colors: true });

  return {
    charges: charges.data.map((c) => ({
      id: c.id,
      amount: c.amount,
      currency: c.currency,
      email: c.billing_details.email,
      name:c.billing_details.name,
      paid: c.paid,
      receiptUrl:c.receipt_url,
      createdAt: new Date(c.created * 1000),
    })),
    hasMore: charges.has_more,
    lastId: charges.data.length > 0 ? charges.data[charges.data.length - 1].id : null,
  };
}

async getTotalRevenue() {
  const charges = await this.stripe.charges.list({ limit: 100 }); // Or paginate
  const total = charges.data
    .filter((c) => c.paid && !c.refunded)
    .reduce((sum, c) => sum + c.amount, 0);
  return total / 100; // Stripe uses cents
}
  
  async getSubscriptions(limit = 10, startingAfter?: string) {
  const params: Stripe.SubscriptionListParams = { limit };
  if (startingAfter) {
    params.starting_after = startingAfter;
  }

  const subscriptions = await this.stripe.subscriptions.list(params);

  return {
    subscriptions: subscriptions.data.map((s) => ({
      id: s.id,
      customer: typeof s.customer === 'string' ? s.customer : s.customer.id,
      status: s.status,
      currentPeriodEnd: new Date(s.items.data[0].current_period_end * 1000),
      createdAt: new Date(s.created * 1000),
    })),
    hasMore: subscriptions.has_more,
    lastId: subscriptions.data.length > 0 ? subscriptions.data[subscriptions.data.length - 1].id : null,
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
