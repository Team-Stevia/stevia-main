import {
    Module, 
} from '@nestjs/common';
import {
    AppController, 
} from './app.controller';
import {
    AppService, 
} from './app.service';
import {
    ConfigModule, 
} from '@nestjs/config';
import {
    PrismaService, 
} from './prisma/prisma.service';
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

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal: true,
        cache: true,
        envFilePath: '.env',
    }),
    PrismaModule,
    BoardsModule,
    PrismaModule,
    UsersModule,
    AuthModule,],
    controllers: [AppController,],
    providers: [AppService,
        PrismaService,],
})
export class AppModule {
}
