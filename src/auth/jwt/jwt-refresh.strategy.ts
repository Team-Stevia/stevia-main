import {
    Injectable, UnauthorizedException, 
} from '@nestjs/common';
import {
    PassportStrategy, 
} from '@nestjs/passport';
import {
    ExtractJwt, Strategy, 
} from 'passport-jwt';
import {
    JwtPayload, 
} from './jwt.payload';
import {
    AuthService, 
} from '../auth.service';
import {
    PrismaService, 
} from "../../prisma/prisma.service";

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(private readonly authService: AuthService,
        private readonly prismaService: PrismaService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: `${process.env.JWT_SECRET}`,
            passReqToCallback: true,
        });
    }

    async validate(req: any, payload: JwtPayload) {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();

        const user = await this.prismaService.user.findUnique({
            where:{
                student_id: payload.studentId,
            },
        });

        if (!user) {
            throw new UnauthorizedException();
        }

        return {
            ...user,
            refreshToken, 
        };
    }
}
