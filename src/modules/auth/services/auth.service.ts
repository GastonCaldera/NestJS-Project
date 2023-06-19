import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/schemas/user.schema';
import { SignInGoogleDto } from '../dtos/signin-google.dto';
import { SignInDto } from '../dtos/signin.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signIn({ email, password }: SignInDto) {
    const checkUser: User[] = await this.userModel
      .find({ email, password })
      .exec();
    if (checkUser[0]?.password !== password) {
      return {
        status: 'ERROR',
        message: 'Email or Password incorrect',
        data: '',
      };
    }
    const payload = { sub: checkUser[0]._id, email: checkUser[0].email };
    return {
      status: 'OK',
      message: 'SingIn correctly',
      data: {
        email: checkUser[0].email,
        _id: checkUser[0]._id,
        access_token: await this.jwtService.signAsync(payload),
      },
    };
  }
  async googleLogin(req: SignInGoogleDto) {
    try {
      if (!req.user) {
        return {
          status: 'ERROR',
          message: 'No user from google',
          data: '',
        };
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
