import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import express from 'express';

const router = Router();


router.post('/payment', express.raw({ type: 'application/json' }), paymentController);

export default router;