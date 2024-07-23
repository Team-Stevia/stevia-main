import {
    Controller,
    Delete,
    Get,
    Param,
    Post,
} from "@nestjs/common";
import {
    KeyService,
} from "./key.service";

@Controller("/api/keys")
export class KeyController {
    constructor(private readonly keyService: KeyService) {
    }

    // 키 상태
    @Get()
    async currentKey(): Promise<any> {
        return "성공";
    }

    // 키 대여
    @Post("/:reserveId")
    async keyRental(@Param("reserveId") reserveId: string): Promise<void> {
        return await this.keyService.rentalKey(reserveId);
    }

    // 키 반납
    @Delete("/:reserveId")
    async keyReturn(@Param("reserveId") reserveId: string): Promise<void> {
        return await this.keyService.rentalKey(reserveId);
    }
}
