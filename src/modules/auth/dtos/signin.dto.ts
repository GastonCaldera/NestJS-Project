import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';
import { PASSWORD_REGEX } from '../constants/regex.const.ts';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 30)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must has at least one uppercase letter and a number or special character',
  })
  public password: string;
}
