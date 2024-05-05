import express from 'express';
import ScheduleControllers from './schedule.controller';

const router = express.Router();

router.post('/', ScheduleControllers.createSchedule);
export const ScheduleRoutes = router;
