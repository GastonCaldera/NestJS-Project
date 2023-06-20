import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from 'src/modules/auth/guard/auth.guard';
import { UserService } from '../services/user.service';
import { UserRequestDto } from '../dtos/user.request.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}
  @UseGuards(AuthGuard)
  @Get('info')
  getProfile(@Request() req: UserRequestDto) {
    return this.userService.getProfile(req.user);
  }
}
