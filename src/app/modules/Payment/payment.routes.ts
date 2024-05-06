import express from 'express';
import PaymentControllers from './payment.controller';
const router = express.Router();

router.post('/init-payment/:appointmentId', PaymentControllers.initPayment);

const PaymentRoutes = router;

export default PaymentRoutes;
