import {
    BadRequestException,
    Injectable,
} from '@nestjs/common';
import {
    PrismaService,
} from '../prisma/prisma.service';

@Injectable()
export class BoardsRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    // 해당 강의실이 있는지 확인
    async checkRoomIdExists(roomId: string) {
        const result = await this.prismaService.building_room.findUnique({
            where: {
                id: roomId,
            },
        });

        if (!result) {
            throw new BadRequestException('해당 건물과 강의실은 존재하지 않습니다.');
        }

        return true;
    }

    // 예약 정보 저장
    async saveReservation(usageTime: string,roomId: string, reserverId: string) {
        const reservationResult = await this.prismaService.reservation.create({
            data: {
                usage_time: usageTime,
                reserve_time: new Date(),
                room_id: roomId,
                reserver_id: reserverId,
            },
        });

        return reservationResult.id;
    };
}
