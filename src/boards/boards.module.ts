import {
    Module, 
} from '@nestjs/common';
import {
    BoardsService, 
} from './boards.service';
import {
    BoardsController, 
} from './boards.controller';
import {
    PrismaModule, 
} from '../prisma/prisma.module';
import {
    BoardsRepository, 
} from './boards.repository';

@Module({
    imports: [PrismaModule,],
    controllers: [BoardsController,],
    providers: [BoardsService,
        BoardsRepository,],
})
export class BoardsModule {}
