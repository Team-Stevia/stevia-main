import {
    Controller,
    Get,
    Param,
    Post,
} from "@nestjs/common";
import {
    KeyService,
} from "./key.service";

@Controller("/api/key")
export class KeyController {
    constructor(private readonly keyService: KeyService) {
    }

    @Get("/:reserveId")
    async keyRental(@Param("reserveId") reserveId: string): Promise<void> {
        return await this.keyService.getReserveId(reserveId);
    }

    @Post()
    async postSuccess() {
        return "성공";
    }
}
