import {
    Injectable, 
} from "@nestjs/common";
import {
    PrismaService, 
} from "../prisma/prisma.service";
import {
    UserSigninRequestDto, 
} from "./dtos/user.signin.request.dto";

@Injectable()
export class UsersRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    async signinUser(signinDto: UserSigninRequestDto): Promise<string> {
        try {
            const user = await this.prismaService.user.findUnique({
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

    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<string> {
        try {
            // 사용자 조회
            const user = await this.prismaService.user.findUnique({
                where: {
                    student_id: userId,
                },
            });

            if (!user) {
                throw new Error('사용자를 찾을 수 없습니다.');
            }

            // 현재 비밀번호 일치 여부 확인
            if (user.password !== currentPassword) {
                throw new Error('현재 비밀번호가 일치하지 않습니다.');
            }

            // 비밀번호 업데이트
            await this.prismaService.user.update({
                where: {
                    student_id: userId,
                },
                data: {
                    password: newPassword,
                },
            });

            return '비밀번호가 성공적으로 변경되었습니다.';
        } catch (error) {
            throw error;
        }
    }
}
