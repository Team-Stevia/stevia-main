import {
    BadRequestException, Injectable, 
} from '@nestjs/common';
import {
    PrismaService, 
} from '../prisma/prisma.service';
import {
    Prisma, 
} from '@prisma/client';

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
            throw new BadRequestException('해당 강의실은 존재하지 않습니다.');
    }

    // 예약 정보 저장
    async saveReservation(usageTime: string, roomId: string, reserverId: string): Promise<{reserveId: string}> {
        const reservationInfo = await this.prismaService.reservation.create({
            data: {
                usage_time: usageTime,
                reserve_time: new Date(),
                room_id: roomId,
                reserver_id: reserverId,
            },
        });

        return {
            reserveId: reservationInfo.id,
        };
    };

    // 강의실 정보 반환
    async getRoomInfo(roomId: string): Promise<Prisma.building_roomCreateInput> {
        const roomInfo = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!roomInfo) {
            throw new BadRequestException('해당 강의실은 존재하지 않습니다.');
        } else {
            return roomInfo;
        }
    }

    // 해당 강의실의 모든 예약 시간 반환
    async getReservedTime(roomId: string): Promise<{reserved_time: string}> {
        // [{usage_time: "9, 10, 11"}, {usage_time: "13, 14"}]
        const reservedTimeArray =  await this.prismaService.reservation.findMany({
            where: {
                room_id: roomId,
            },
            select: {
                usage_time: true,
            },
        });

        // "9, 10, 11, 13, 14"
        const mergedReservedTime = reservedTimeArray.map(item => item.usage_time).join(',');

        return {
            reserved_time: mergedReservedTime,
        };
    }
}
