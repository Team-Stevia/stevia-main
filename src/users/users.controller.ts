import {
    Body,
    Controller,
    Post,
} from "@nestjs/common";
import {
    UsersService,
} from "./users.service";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";

@Controller("api/users")
export class UsersController {
    constructor(private readonly userService: UsersService) {
    }

    // 회원가입
    @Post()
    async signup(): Promise<any> {
        return "회원가입";
    }

    // 로그인
    @Post("/signin")
    async signin(@Body() signinDto: UserSigninRequestDto): Promise<any> {
        return await this.userService.signinUser(signinDto);
    }

    // 비밀번호 수정

}
