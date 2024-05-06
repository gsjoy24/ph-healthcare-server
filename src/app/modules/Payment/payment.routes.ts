import express from 'express';
import PaymentControllers from './payment.controller';
const router = express.Router();

router.get('/init-payment', PaymentControllers.initPayment);

const PaymentRoutes = router;

export default PaymentRoutes;
