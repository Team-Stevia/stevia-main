import {
    Injectable, 
} from '@nestjs/common';
import {
    BoardsRepository, 
} from './boards.repository';

@Injectable()
export class BoardsService {
    constructor(private readonly boardsRepository: BoardsRepository) {
    }

    /**
   * 강의실 예약 시나리오
   * 1. 강의실 예약 관련 DTO를 받는다.
   *    DTO 정보: usageTime, reserveTime
   * 2. room_id가 유효한 지 검사한다.
   * 3. token을 검증해 예약자가 누구인지 확인 후 reserver_id를 가져온다.
   * 4. usageTime, reserveTime, reserver_id, room_id 데이터를 reservation 테이블에 삽입 해 예약 정보를 저장한다.
   */

    // 강의실 예약 비즈니스 로직
    async reserveRoom(usageTime: string, roomId: string, reserverId: string): Promise<string> {
        await this.boardsRepository.checkRoomIdExists(roomId);

        return this.boardsRepository.saveReservation(usageTime, roomId, reserverId);
    }

}
