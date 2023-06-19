import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

class User {
  @IsEmail()
  @IsNotEmpty()
  public email: string;
}

export class SignInGoogleDto {
  @IsString()
  @IsNotEmpty()
  public message: string;

  public user: User;
}
