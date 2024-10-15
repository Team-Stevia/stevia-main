import {
    IsNotEmpty,
    IsNumber,
    IsString,
} from "class-validator";

export class UserSigninRequestDto {
    @IsNotEmpty()
    @IsNumber()
    studentId: number;

    @IsNotEmpty()
    @IsString()
    password: string;
}
