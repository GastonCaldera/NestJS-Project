import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
import { SignInGoogleDto } from '../dtos/signin-google.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async googleLogin(req: SignInGoogleDto) {
    try {
      if (!req.user) {
        return 'No user from google';
      }
      const checkUser = await this.userModel
        .find({ email: req.user.email })
        .exec();
      if (checkUser.length > 0) {
        return {
          status: 'OK',
          message: 'User Info from Google',
          data: { email: checkUser[0].email, _id: checkUser[0]._id },
        };
      } else {
        const createdUser = new this.userModel({ email: req.user.email });
        createdUser.save();
        return {
          status: 'OK',
          message: 'User Info from Google',
          data: 'createdUser',
        };
      }
    } catch (error) {
      console.log(error);
      return {
        status: 'ERROR',
        message: 'Server Error',
        data: '',
      };
    }
  }
}
