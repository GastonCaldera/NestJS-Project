import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Matches,
  Length,
} from 'class-validator';
import { PASSWORD_REGEX } from '../constants/regex.const.ts';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 30)
  @Matches(PASSWORD_REGEX, {
    message:
      'Password must has at least one uppercase letter and a number or special character',
  })
  public password: string;
}
