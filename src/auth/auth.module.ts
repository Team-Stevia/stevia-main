import {
    forwardRef,
    Module,
} from "@nestjs/common";
import {
    AuthService, 
}    from "./auth.service";
import {
    PrismaModule, 
} from "../prisma/prisma.module";
import {
    JwtModule, 
} from "@nestjs/jwt";
import {
    UsersModule, 
} from "../users/users.module";
import {
    JwtStrategy, 
} from "./jwt/jwt.strategy";
import {
    JwtRefreshStrategy, 
} from "./jwt/jwt-refresh.strategy";

@Module({
    imports:[PrismaModule,
        // 로그인할 때 사용하는 모듈
        JwtModule.register({
            global: true,
            secret: `${process.env.JWT_SECRET}`, // 여기에 비밀 키 추가
            signOptions: {
                expiresIn: 3600,
            },
        }),
        
        forwardRef(()=> UsersModule),
    ],
    providers: [AuthService,
        JwtStrategy,
        JwtRefreshStrategy,],
    exports: [AuthService,
        JwtStrategy,
    ],

})
export class AuthModule {
}
