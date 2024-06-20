import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {
    JwtService,
} from "@nestjs/jwt";
import {
    UserSigninRequestDto,
} from "../users/dtos/user.signin.request.dto";
import {
    PrismaService,
} from "../prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly jwtService: JwtService
    ) {
    }

    async signInWithStudentIdAndPassword(user: UserSigninRequestDto): Promise<any> {
        const existingUser = await this.authenticateWithStudentIdAndPassword(user);

        return this.returnToken(existingUser);
    }

    async authenticateWithStudentIdAndPassword(user: UserSigninRequestDto): Promise<any> {
        // const existingUser = await this.userService.getUserByStudentId(user.studentId);
        const existingUser = await this.prismaService.user.findFirst({
            where: {
                student_id: user.studentId,
            },
        });

        if (!existingUser) {
            throw new UnauthorizedException("존재하지 않은 사용자입니다.");
        }

        if (existingUser.password !== user.password) {
            throw new UnauthorizedException("비밀번호가 틀렸습니다.");
        }

        return existingUser;
    }

    signToken(user: UserSigninRequestDto, isRefreshToken: boolean): string {
        const payload = {
            studentId: user.studentId,
            type: isRefreshToken ? "refresh" : "access",
        };

        return this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: isRefreshToken ? 3600 : 300,
        });
    }

    returnToken(user: UserSigninRequestDto): { accessToken: string, refreshToken: string } {
        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true),
        };
    }

    extractTokenFromHeader(header: string, isBearer: boolean): string {
        const splitToken = header.split(" ");

        const prefix = isBearer ? "Bearer" : "Basic";

        if (splitToken.length !== 2 || splitToken[0] !== prefix) {
            throw new UnauthorizedException("잘못된 토큰입니다.");
        }

        const token = splitToken[1];

        return token;
    }

    verifyToken(token: string): any {
        try {
            return this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET,
            });
        } catch (err) {
            throw new UnauthorizedException("토큰이 만료되었거나 잘못된 토큰입니다.");
        }
    }

    rotateToken(token: string, isRefreshToken: boolean): string {
        const decoded = this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
        });

        if (decoded.type !== "refresh") {
            throw new UnauthorizedException("토큰 재발급은 Refresh 토큰으로만 가능합니다.");
        }

        return this.signToken(
            {
                ...decoded,
            }, isRefreshToken);
    }

}
