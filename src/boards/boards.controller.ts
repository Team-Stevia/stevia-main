import {
    Body,
    Controller, Get, Param, ParseUUIDPipe, Post,
} from '@nestjs/common';
import {
    BoardsService, 
} from './boards.service';

@Controller('api/boards')
export class BoardsController {
    constructor(private readonly boardsService: BoardsService) {}

  // 강의실 예약
  @Post('/reservation/:roomId')
    async postReserveRoom(@Param('roomId', ParseUUIDPipe) roomId: string,
                          @Body('usageTime') usageTime: string) {

        // 현재 token이 구현되어 있지 않아 더미 데이터 삽입
        const reserverId = '1be6154b-0ffb-4788-b84a-34343a149324';

        const reserveRoomDto = {
            roomId,
            usageTime,
            reserverId,
        };

        return await this.boardsService.reserveRoom(reserveRoomDto);
    }

  // 강의실 시간표 조회
  @Get('/timetable/:roomId')
  async getRoomTimetable(@Param('roomId') roomId: string) {
      return await this.boardsService.getRoomTimetable(roomId);
  }
}
