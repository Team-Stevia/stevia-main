import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {
    PrismaService,
} from "../prisma/prisma.service";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    UserSigninRequestDto,
} from "../users/dtos/user.signin.request.dto";
import {
    JwtPayload,
} from "./jwt/jwt.payload";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private jwtService: JwtService
    ) {
    }

    async signIn(userDto: UserSigninRequestDto): Promise<{ access_token: string }> {
        const user = await this.prismaService.user.findUnique({
            where: {
                student_id: userDto.studentId,
            },
        });

        if (user?.password !== userDto.password) {
            throw new UnauthorizedException();
        }

        const payload: JwtPayload = {
            studentId: user.student_id,
            name: user.name,
        };

        // jwt에서 지원해주는 sign으로 토큰을 생성함
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
            const user = await this.prismaService.user.findUnique({
                where: {
                    student_id: payload.studentId,
                },
            });

            if (!user) {
                throw new Error("Invalid token");
            }

            return "로그인을 다시 진행해 주세요.";
        } catch (e) {
            throw new Error("Invalid token");
        }
    }
}
