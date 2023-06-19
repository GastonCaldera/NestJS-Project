import { Controller, Get, Post, Req, UseGuards, Body } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { SignInGoogleDto } from '../dtos/signin-google.dto';
import { SignInDto } from '../dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('signin')
  signIn(@Body() body: SignInDto) {
    return this.authService.signIn({
      email: body.email,
      password: body.password,
    });
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    return req;
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: SignInGoogleDto) {
    return this.authService.googleLogin(req);
  }
}
