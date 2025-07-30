import { NextFunction, Request, Response } from 'express';
import { StripeService } from '../../../../libs/infrastructure/stripe/stripe.service';
import { HandleStripeWebhookUseCase } from '../../../../libs/application/use-cases/webhook/handle-stripe.usecase';
import { PrismaOrganizationRepository } from '../../../../libs/infrastructure/prisma/org.repository';
import { HttpStatus } from '../../../../libs/shared/constants/http-status.enum';


export const paymentController = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const sig = req.headers['stripe-signature'] as string;
        const stripeService = new StripeService();
        const event = stripeService.verifyWebhookSignature(req.body, sig);
        const orgRepo = new PrismaOrganizationRepository()
        const useCase = new HandleStripeWebhookUseCase(stripeService, orgRepo);
    await useCase.execute(event);
    res.status(HttpStatus.OK).send('Webhook handled');
  } catch (error: any) {
    console.error('Webhook Error:', error.message);
    res.status(400).send('Webhook error');
  }
};
