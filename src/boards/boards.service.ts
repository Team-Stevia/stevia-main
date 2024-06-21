import {
    Injectable,
} from "@nestjs/common";
import {
    BoardsRepository,
} from "./boards.repository";
import {
    ReserveRoomDto,
} from "./dtos/boards.dto";

@Injectable()
export class BoardsService {
    constructor(private readonly boardsRepository: BoardsRepository) {
    }

    /**
     * 강의실 예약 시나리오
     * 1. 강의실 예약 관련 DTO를 받는다.
     *    DTO = usageTime
     * 2. roomId가 유효한 지 검사한다.
     * 3. token을 검증해 예약자가 누구인지 확인 후 reserver_id를 가져온다.
     * 4. usageTime, reserveTime, reserver_id, room_id 데이터를 reservation 테이블에 삽입하여 예약 정보를 저장한다.
     */
    // 강의실 예약 비즈니스 로직
    async reserveRoom(reserveRoomDto: ReserveRoomDto): Promise<{ reserveId: string }> {
        const {
            usageTime,
            roomId,
            reserverId,
        } = reserveRoomDto;

        await this.boardsRepository.checkRoomExists(roomId);

        return this.boardsRepository.saveReservation(usageTime, roomId, reserverId);
    }

    /**
     * 강의실 시간표 조회 시나리오
     * 1. 조회할 강의실의 id 값을 받는다.
     * 2. id 정보를 통해 강의실 정보를 조회한다.
     * 3. 2번을 통해 조회된 데이터 -> buildingLocation, buildingName, roomNo, roomImageUrl
     * 4. 강의실 id는 reservation table이 외래키로 가지고 있다.
     * 5. 해당 id와 일치하는 외래키 값을 가지는 예약 정보에 접근하여 usageTime을 가져온다.
     */
    // 강의실 시간표 조회 비즈니스 로직
    async getRoomTimetable(roomId: string) {
        const RoomInfo = await this.boardsRepository.getRoomInfo(roomId);

        const reservedTime = await this.boardsRepository.getReservedTime(roomId);

        const todayDate = {
            today_date: new Date(),
        };

        return {
            ...RoomInfo,
            ...reservedTime,
            ...todayDate,
        };
    }
}
