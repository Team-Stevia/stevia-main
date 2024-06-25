import {
    BadRequestException, Injectable, 
} from '@nestjs/common';
import {
    PrismaService, 
} from '../prisma/prisma.service';

@Injectable()
export class BoardsRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    // 강의실 존재 여부 확인
    async checkRoomExists(roomId: string): Promise<void> {
        const result = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!result)
            throw new BadRequestException("해당 강의실은 존재하지 않습니다.");
    }

    // 학번을 통해 학생 정보 조회
    async getStudentByStudentNo(studentNo: number) {
        const student = await this.prismaService.user.findUnique({
            where: {
                student_id: studentNo,
            },
        });

        if (!student) {
            throw new BadRequestException('해당 사용자는 없습니다.');
        } else {
            return student;
        }
    }

    // 강의실 예약
    async saveReservation(usageTime: string, roomId: string, reserverId: string) {
        const reservation = await this.prismaService.reservation.create({
            data: {
                usage_time: usageTime,
                reserve_time: new Date(),
                room_id: roomId,
                reserver_id: reserverId,
            },
        });

        return reservation;
    };

    // 강의실 정보 반환
    async getRoomInfo(roomId: string) {
        const roomInfo = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!roomInfo) {
            throw new BadRequestException("해당 강의실은 존재하지 않습니다.");
        } else {
            return roomInfo;
        }
    }

    // 해당 강의실의 예약 시간 반환
    async getRoomReservedTime(roomId: string): Promise<{ reserved_time: string }> {
        // Example: [{usage_time: "9, 10, 11"}, {usage_time: "13, 14"}]
        const reservedTimeArray = await this.prismaService.reservation.findMany({
            where: {
                room_id: roomId,
            },
            select: {
                usage_time: true,
            },
        });

        // "9, 10, 11, 13, 14"
        const mergedReservedTime = reservedTimeArray.map(item => item.usage_time).join(",");

        return {
            reserved_time: mergedReservedTime,
        };
    }

    // 학생의 강의실 예약 정보 조회
    getReservationInfoByReserverId(reserverId: string) {
        return this.prismaService.reservation.findFirst({
            where: {
                reserver_id: reserverId,
            },
        });
    }

    // 기본 강의실 목록 반환
    getDefaultRoomList(buildingLocation: string = "N3"):Promise<{id: string, room_no: number}[]> {
        return this.prismaService.building_room.findMany({
            where: {
                building_location: buildingLocation,
            },
            select: {
                id: true,
                room_no: true,
            },
        });
    }

    async getOtherbuildingList() {
        return this.prismaService.building_room.findMany({
            select: {
                id: true,
                building_location: true,
            },
            distinct: ['building_location',],
        });
    }

    async getBuildingLocation(roomId: string): Promise<{building_location: string}> {
        const buildingLocation = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
            select: {
                building_location: true,
            },
        });

        if (!buildingLocation) {
            throw new BadRequestException('해당 건물은 존재하지 않습니다.');
        } else {
            return buildingLocation;
        }
    }

    async getRoomList(buildingLocation: string) {
        const roomList = await this.prismaService.building_room.findMany({
            where: {
                building_location: buildingLocation,
            },
            select: {
                id: true,
                room_no: true,
            },
        });

        return roomList;
    }
}
