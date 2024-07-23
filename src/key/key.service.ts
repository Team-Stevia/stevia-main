import {
    Injectable,
} from "@nestjs/common";
import {
    KeyRepository,
} from "./key.repository";

@Injectable()
export class KeyService {
    constructor(private readonly keyRepository: KeyRepository) {
    }

    // URL에서 reserveId 추출 함수
    async rentalKey(reserveId: string): Promise<any> {
        return await this.keyRepository.rentalKey(reserveId);
    }
}
