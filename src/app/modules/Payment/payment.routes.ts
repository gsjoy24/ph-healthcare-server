import express from 'express';
import PaymentControllers from './payment.controller';
const router = express.Router();

router.get('/ipn', PaymentControllers.validatePayment);
router.post('/init-payment/:appointmentId', PaymentControllers.initPayment);

const PaymentRoutes = router;

export default PaymentRoutes;
