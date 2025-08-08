export type ChargeDTO = {
  id: string;
  amount: number;
  currency: string;
  email: string | null;
  paid: boolean;
  createdAt: Date;
};

export type PaymentIntentDTO = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  email: string | null;
  createdAt: Date;
};

export type SubscriptionDTO = {
  id: string;
  customer: string;
  status: string;
  currentPeriodEnd: Date;
  createdAt: Date;
};


export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  items: any;
  created: number;
  [key: string]: any;
}

export interface StripeCharge {
  id: string;
  amount: number;
  status: string;
  created: number;
  [key: string]: any;
}
