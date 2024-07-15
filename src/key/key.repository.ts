import {
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import {
    PrismaService,
} from "../prisma/prisma.service";
import {
    isUUID,
} from "class-validator";
import axios, {
    AxiosResponse,
} from "axios";

@Injectable()
export class KeyRepository {
    constructor(private readonly prismaService: PrismaService) {
    }

    // Comm 요청 보내기
    async sendReservationDetails(reserveId: string): Promise<void> {
        const isValid = await this.checkReserveId(reserveId);

        if (isValid) {
            const reservation = await this.prismaService.reservation.findUnique({
                where: {
                    id: reserveId,
                },
                select: {
                    room_id: true,
                },
            });

            if (reservation) {
                const buildingRoom = await this.prismaService.building_room.findUnique({
                    where: {
                        id: reservation.room_id,
                    },
                    select: {
                        room_no: true,
                        building_location: true,
                    },
                });

                if (buildingRoom) {
                    try {
                        const commResponse = await this.sendCommRequest(buildingRoom);

                        // 응답의 door_status가 OPEN이면 프론트엔드에 응답을 보냅니다.
                        if (commResponse.door_status === "OPEN") {
                            await this.notifyFrontend({
                                "키대여응답": true,
                            });
                            // eslint-disable-next-line
                            console.log("Reservation details sent and frontend notified successfully");
                        }
                    } catch (error) {
                        if (axios.isAxiosError(error)) {
                            // eslint-disable-next-line
                            console.error("Axios error:", {
                                message: error.message,
                                code: error.code,
                                config: error.config,
                                response: error.response?.data,
                            });
                        } else {
                            // eslint-disable-next-line
                            console.error("Unexpected error:", error);
                        }
                    }
                }
            }
        }
    }

    // Comm 요청 보내기
    private async sendCommRequest(buildingRoom: { room_no: number, building_location: string }): Promise<{
        door_status: string
    }> {
        try {
            const response: AxiosResponse<{
                door_status: string
            }> = await axios.post("http://localhost:3000/api/key/take-key", buildingRoom);

            return response.data;
        } catch (error) {
            throw new HttpException("Comm 요청에 실패했습니다.", HttpStatus.BAD_REQUEST);
        }
    }

    // 프론트엔드로 응답을 보냅니다.
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    private async notifyFrontend(data: { "키대여응답": boolean }) {
        try {
            await axios.post("http://localhost:3001/api/notify", data);
        } catch (error) {
            throw new HttpException("프론트엔드로 응답 전송에 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 예약 아이디 여부 확인
    async checkReserveId(reserveId: string): Promise<boolean> {
        // UUID 형식이 맞는지 확인
        if (!isUUID(reserveId)) {
            throw new HttpException("reserveId 형식이 올바르지 않습니다.", HttpStatus.NOT_FOUND);
        }

        const result = await this.prismaService.reservation.findUnique({
            where: {
                id: reserveId,
            },
        });

        // 예약 내역이 없을 경우 Error
        if (!result) {
            throw new HttpException("예약 내역이 없습니다.", HttpStatus.NOT_FOUND);
        }

        return !!result;
    }

}
