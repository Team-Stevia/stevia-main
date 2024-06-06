import {
    Injectable,
} from "@nestjs/common";
import {
    PrismaClient,
} from "@prisma/client";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";

const prisma = new PrismaClient();

@Injectable()
export class UsersService {
    // 로그인
    async signinUser(signinDto: UserSigninRequestDto): Promise<string> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    student_id: signinDto.studentId,
                },
            });

            if (!user || user.password !== signinDto.password) {
                return "로그인 실패";
            }

            return "로그인 성공";
        } catch (error) {
            throw error;
        }
    }
}
