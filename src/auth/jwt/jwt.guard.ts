import {
    Injectable,
} from "@nestjs/common";
import {
    AuthGuard,
} from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
// AuthGuard는 strategy를 자동으로 실행해주는 기능이 있음
