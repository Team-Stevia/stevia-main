import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from "@nestjs/common";
import {
    UsersService,
} from "./users.service";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";

import {
    GetUser,
} from "../auth/get-user.decorator";

import {
    JwtAuthGuard,
} from "../auth/jwt/jwt.guard";
import {
    UserChangePasswordRequestDto, 
} from "./dtos/user.changePassword.request.dto";

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
    async signIn(@Body() signInDto: UserSigninRequestDto): Promise<any> {
        return await this.userService.signInUser(signInDto);
    }

    // 비밀번호 수정
    @Patch("/:userId")
    async resetPassword(
        @Param("userId") userId: number,
        @Body() userChangePasswordRequestDto:UserChangePasswordRequestDto
        // @Body() password: {
        //     currentPassword: string,
        //     newPassword: string
        // }
    ): Promise<string> {
        return await this.userService.changePassword(userId,userChangePasswordRequestDto);
    };

    @Get("/test")
    @UseGuards(JwtAuthGuard)
    async test(@GetUser() user:any):Promise<string> {
        console.log("user", user);

        return "인증성공";
    }
}
