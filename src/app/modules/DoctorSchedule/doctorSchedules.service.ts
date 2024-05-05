import { Doctor, DoctorSchedules } from '@prisma/client';
import prisma from '../../../utils/prisma';

const createDoctorSchedule = async (doctorEmail: string, payload: { schedules: string[] }) => {
	const doctorData = (await prisma.doctor.findUnique({ where: { email: doctorEmail } })) as Doctor;

	const scheduleData = payload.schedules.map((scheduleId) => ({ doctorId: doctorData?.id, scheduleId }));

	const result = await prisma.doctorSchedules.createMany({
		data: scheduleData
	});
	return result;
};

const DoctorScheduleServices = {
	createDoctorSchedule
};

export default DoctorScheduleServices;
