import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/schemas/user.schema';
import { SignInGoogleDto } from '../dtos/signin-google.dto';
import { SignInDto } from '../dtos/signin.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}
  async signIn({ email, password }: SignInDto) {
    try {
      const checkUser: User[] = await this.userModel.find({ email }).exec();
      const isMatch = await bcrypt.compare(
        password,
        checkUser[0]?.password === undefined ? '' : checkUser[0]?.password,
      );
      if (!isMatch) {
        return {
          status: 'ERROR',
          message: 'Email or Password incorrect',
          data: '',
        };
      }
      const payload = { _id: checkUser[0]._id, email: checkUser[0].email };
      return {
        status: 'OK',
        message: 'SingIn correctly',
        data: {
          email: checkUser[0].email,
          _id: checkUser[0]._id,
          access_token: await this.jwtService.signAsync(payload),
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
  async signUp({ email, password }: SignInDto) {
    const checkUser = await this.userModel.find({ email }).exec();
    if (checkUser.length > 0) {
      return {
        status: 'ERROR',
        message: 'Email is already used',
        data: '',
      };
    } else {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const createdUser = new this.userModel({ email, password: hash });
      createdUser.save();
      const payload = { _id: createdUser._id, email: createdUser.email };
      return {
        status: 'OK',
        message: 'SingUp correctly',
        data: {
          id: createdUser._id,
          email: createdUser.email,
          access_token: await this.jwtService.signAsync(payload),
        },
      };
    }
    return '';
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
        const payload = { _id: checkUser[0]._id, email: checkUser[0].email };
        return {
          status: 'OK',
          message: 'User Info from Google',
          data: {
            id: checkUser[0]._id,
            email: checkUser[0].email,
            access_token: await this.jwtService.signAsync(payload),
          },
        };
      } else {
        const createdUser = new this.userModel({ email: req.user.email });
        createdUser.save();
        const payload = { _id: createdUser._id, email: createdUser.email };
        return {
          status: 'OK',
          message: 'User Info from Google',
          data: {
            id: createdUser._id,
            email: createdUser.email,
            access_token: await this.jwtService.signAsync(payload),
          },
        };
      }
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
