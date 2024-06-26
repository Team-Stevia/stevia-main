import {
    Controller,
    Get,
    Param,
} from "@nestjs/common";
import {
    KeyService,
} from "./key.service";

@Controller("/api/key")
export class KeyController {
    constructor(private readonly keyService: KeyService) {
    }

    @Get("/:reserveId")
    async keyRental(@Param("reserveId") reserveId: string): Promise<string> {
        return await this.keyService.getReserveId(reserveId);
    }
}
