import { Injectable, Request } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from '../schemas/user.schema';
import { UserDto } from '../dtos/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async getProfile(@Request() user: UserDto) {
    try {
      const findUser: User | null = await this.userModel
        .findOne({ email: user.email })
        .exec();
      return {
        status: 'OK',
        message: 'User found successfully',
        data: {
          email: findUser?.email,
          _id: findUser?._id,
        },
      };
    } catch (error) {
      console.log(error);
      return {
        status: 'ERROR',
        message: 'Internal server error',
        data: '',
      };
    }
  }
}
