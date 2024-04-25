import bcrypt from 'bcrypt';
import prisma from '../../../utils/prisma';
const loginUser = async (email: string, password: string) => {
	const userData = await prisma.user.findUniqueOrThrow({
		where: {
			email
		}
	});

   const isPasswordValid = await bcrypt.compare(password, userData.password);
   console.log(isPasswordValid);

	return userData;
};

const AuthServices = {
	loginUser
};

export default AuthServices;
