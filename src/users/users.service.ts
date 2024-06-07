import {
    Injectable,
} from "@nestjs/common";
import {
    UserSigninRequestDto,
} from "./dtos/user.signin.request.dto";
import {
    UsersRepository, 
} from "./users.repository";

@Injectable()
export class UsersService {
    constructor(private readonly userRepository: UsersRepository) {
    }

    // 로그인
    async signinUser(signinDto: UserSigninRequestDto): Promise<string> {
        return this.userRepository.signinUser(signinDto);
    }

    // 비밀번호 수정
    async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<string> {
        return this.userRepository.changePassword(userId, currentPassword, newPassword);
    }

}
