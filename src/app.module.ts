import {
    Module, 
} from '@nestjs/common';
import {
    ConfigModule, 
} from '@nestjs/config';
import {
    PrismaModule, 
} from './prisma/prisma.module';
import {
    BoardsModule, 
} from './boards/boards.module';
import {
    UsersModule,
} from "./users/users.module";
import {
    AuthModule,
}  from "./auth/auth.module";
import {
    ServeStaticModule,
} from '@nestjs/serve-static';
import {
    join,
} from 'path';

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        envFilePath: '.env',
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..'),
    }),
    PrismaModule,
    BoardsModule,
    UsersModule,
    AuthModule,],
    controllers: [],
    providers: [],
})
export class AppModule {
}
