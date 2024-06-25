import {
    Injectable, 
} from '@nestjs/common';
import {
    BoardsRepository, 
} from './boards.repository';
import {
    ReserveRoomDto, 
} from './dtos/boards.dto';

@Injectable()
export class BoardsService {
    constructor(private readonly boardsRepository: BoardsRepository) {
    }
    /**
     * reserveRoom(): 강의실 예약
     *
     * @param reserveRoomDto = usageTime(이용시간), roomId(강의실 아이디)
     * @param studentNo = 학번
     *
     * 1. 예약할 강의실이 존재하는지 확인 -> checkRoomExits(roomId)
     * 2. 예약하는 학생의 정보 갖고 오기 -> getStudentByStudentNo(studentNo)
     * 3. 예약에 필요한 정보(usageTime, roomId, studentId)를 넘겨주어 예약 -> saveReservation(usageTime, roomId, student.id)
     * 4. 예약한 id 반환
     */
    async reserveRoom(reserveRoomDto: ReserveRoomDto, studentNo: number): Promise<{reserveId: string}> {
        const {
            usageTime, roomId,
        } = reserveRoomDto;

        await this.boardsRepository.checkRoomExists(roomId);

        const student = await this.boardsRepository.getStudentByStudentNo(studentNo);

        const reserve = await this.boardsRepository.saveReservation(usageTime, roomId, student.id);

        return {
            reserveId: reserve.id,
        };
    }

    /**
     * getRoomTimetable(): 강의실 시간표 조회
     *
     * @param roomId = 강의실 아이디
     *
     * 1. 조회할 강의실이 존재하는지 확인                 -> checkRoomExists(roomId)
     * 2. 강의실 정보 조회                                -> getRoomInfo(roomId)
     * 3. 해당 강의실에 대한 예약 정보(reservedTime) 조회 -> getRoomReservedTime(roomId)
     * 4. 예약하는 오늘 날짜 객체 생성                    -> todayDate
     */
    async getRoomTimetable(roomId: string) {
        await this.boardsRepository.checkRoomExists(roomId);

        const RoomInfo = await this.boardsRepository.getRoomInfo(roomId);

        const roomReservedTime = await this.boardsRepository.getRoomReservedTime(roomId);

        const todayDate = {
            today_date: new Date(),
        };

        return {
            ...RoomInfo,        // 강의실 정보
            ...roomReservedTime,    // 해당 강의실 예약 정보
            ...todayDate,       // 오늘 날짜
        };
    }

    /**
     * getBoards(): 현황판 조회
     *
     * @param studentNo = 학번
     *
     * 1. 현황판 조회 시, 기본적으로 나오는 건물의 강의실 정보 조회 -> getDefaultRoomList()
     *    - 여기선 기본적으로 나오는 건물은 N3으로 지정
     * 2. 다른 건물의 정보 조회                                     -> getOtherbuildingList()
     * 3. 현재 서비스를 사용하는 학생의 예약 정보 조회              -> getStudentReservationInfo(studentNo)
     */
    async getBoards(studentNo: number) {
        const defaultRoomList =  await this.boardsRepository.getDefaultRoomList();

        const defaultRoomListInN3 = {
            building_location: "N3",
            roomList: defaultRoomList,
        };

        const otherBuildingList = await this.boardsRepository.getOtherbuildingList();

        const reservationInfo = await this.getStudentReservationInfo(studentNo);

        return {
            BuildingAndRoomList: defaultRoomListInN3,
            otherBuildingList: otherBuildingList,
            reservationInfo: reservationInfo,
        };
    }

    // 예약자, 예약 정보 가져오기
    async getStudentReservationInfo(studentNo: number) {
        // 학생 정보 가져오기
        const student = await this.boardsRepository.getStudentByStudentNo(studentNo);

        // 학생이 예약한 예약 정보 가져오기
        const reservation = await this.boardsRepository.getReservationInfoByReserverId(student.id);

        let reservationInfo;

        if (!reservation) {
            reservationInfo = {
                reservationStatus: false,
            };
        } else {
            const room = await this.boardsRepository.getRoomInfo(reservation.room_id);

            reservationInfo = {
                name: student.name,
                buildingLocation: room.building_location,
                roomNo: room.room_no,
                usageTime: reservation.usage_time,
                reserveTime: reservation.reserve_time,
                reservationStatus: true,
            };
        }

        return reservationInfo;
    }

    /**
     * getBoardById(): 현황판 상세 조회
     *
     * @param roomId
     *
     * 1. roomId에 해당하는 buildingLocation 정보 조회          -> getBuildingLocation(roomId)
     * 2. buildingLocation에 해당하는 강의실의 대한 리스트 조회 -> getRoomList(buildingLocation.building_location)
     */
    async getBoardById(roomId: string) {
        const buildingRoom = await this.boardsRepository.getBuildingLocation(roomId);

        const roomList = await this.boardsRepository.getRoomList(buildingRoom.building_location);

        return {
            buildingLocation: buildingRoom.building_location,
            roomList: roomList,
        };
    }
}
