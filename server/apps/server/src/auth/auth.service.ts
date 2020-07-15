import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { User } from '@libs/db/models/user.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { RegisterDto } from './dto/register.dto';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(User) private readonly userModel: ModelType<User>,
  ) {}

  async register(registerDto: RegisterDto): Promise<User> {
    const createdUser = new this.userModel(registerDto);
    return createdUser.save();
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).select('+password');
    if (!user) {
      throw new BadRequestException('用户名不正确');
    }
    if (!compareSync(password, user.password)) {
      throw new BadRequestException('密码不正确');
    }
    return user;
  }

  generateJwtToken(userId: string): any {
    return {
      token: this.jwtService.sign(userId),
    };
  }
  // 获取用户详细信息
  async getUser(id: string): Promise<User> {
    return await this.userModel.findById(id).populate('ugroups');
  }
  // 修改用户信息
  async setUserBaseInfo(id: string, userDto: UserDto): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, userDto);
  }
}
