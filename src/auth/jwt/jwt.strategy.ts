import {
    Injectable,
    UnauthorizedException,
}                   from "@nestjs/common";
import {
    PassportStrategy,
}                   from "@nestjs/passport";
import {
    ExtractJwt,
    Strategy,
}                   from "passport-jwt";
import {
    PrismaService,
}                   from "../../prisma/prisma.service";
import * as process from "node:process";
import {
    JwtPayload,
}                   from "./jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            // 토큰이 유효한지 체크할 때 쓰는 것
            secretOrKey: `${process.env.JWT_SECRET}`,

            // 토큰이 어디서 가져올지 -> 우리는 헤더의 Bearer로
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

            // JWT 만료 기간
            ignoreExpiration: false,
        });
    }

    // FE에서 jwt가 날라와서 읽고 판단하는 과정을 validate의 payload의 유효성 검사를 해야함
    async validate(payload: JwtPayload) {
        // payload가 적합한지 체크를 해야함
        const {
            studentId,
        } = payload;

        const user = await this.prismaService.user.findUnique({
            where: {
                student_id: studentId,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}
