import {
    Injectable,
} from "@nestjs/common";

@Injectable()
export class KeyService {

    async getReserveId(reserveId: string): Promise<string> {
        return reserveId;
    }
}
