import {
    Body,
    Controller, Get, Param, Post,
} from '@nestjs/common';
import {
    BoardsService, 
} from './boards.service';

@Controller('api/boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

  // 강의실 예약
  @Post(':roomId')
    async reserveRoom(@Param('roomId') roomId: string,
                      @Body('usageTime') usageTime: string,) {

        // 현재 token이 구현되어 있지 않아 테스트 더미 데이터를 삽입
        const reserverId = 'ee438cd1-f3f9-4eed-b34c-8437a3749196';

        await this.boardsService.reserveRoom(usageTime, roomId, reserverId);
    }

  // 강의실 시간표 조회
  @Get(':roomId')
  getRoomTimetable(@Param('roomId') roomId: string) {

  }
}
