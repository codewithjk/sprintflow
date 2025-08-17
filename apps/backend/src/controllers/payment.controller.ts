import { NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';
import { handleStripeWebhookUseCase, stripeService } from '../di';


export const paymentController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sig = req.headers['stripe-signature'] as string;
    const event = stripeService.verifyWebhookSignature(req.body, sig);
    await handleStripeWebhookUseCase.execute(event);
    res.status(HttpStatus.OK).send('Webhook handled');
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    res.status(HttpStatus.BAD_REQUEST).send('Webhook error');
  }
};
