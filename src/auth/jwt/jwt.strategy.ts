import {
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import {
    PassportStrategy,
} from "@nestjs/passport";
import {
    ExtractJwt,
    Strategy,
} from "passport-jwt";
import {
    PrismaService,
} from "../../prisma/prisma.service";
import * as process from "node:process";
import {
    JwtPayload, 
} from "./jwt.payload";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly prismaService: PrismaService) {
        super({
            secretOrKey: `${process.env.JWT_SECRET}`, // 토큰이 유효한지 체크할 때 쓰는 것
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // 토큰이 어디서 가져올지 -> 우리는 헤더의 Bearer로
        });
    }

    async validate(payload:JwtPayload) {
        const{
            studentId,
        } = payload;

        const user = await this.prismaService.user.findUnique({
            where:{
                student_id: studentId,
            },
        });

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}
