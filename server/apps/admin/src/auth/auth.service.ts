import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { compareSync } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ChgPasswordDto } from './dto/chgpassword.dto';
import { Admin } from '@libs/db/models/admin.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Admin) private readonly adminModel: ModelType<Admin>,
  ) {}

  async validateAdmin(email: string, password: string): Promise<Admin> {
    const admin = await this.adminModel.findOne({ email }).select('+password');
    if (!admin) {
      throw new BadRequestException('用户名不正确');
    }
    if (!compareSync(password, admin.password)) {
      throw new BadRequestException('密码不正确');
    }
    return admin;
  }

  /* 生成jwtToken */
  generateJwtToken(adminId: string): any {
    return {
      token: this.jwtService.sign(adminId),
    };
  }

  /* 获取用户详细信息 */
  async getAdmin(id: string): Promise<Admin> {
    return await this.adminModel.findById(id);
  }

  /* 修改密码 */
  async changePassword(
    id: string,
    chgPasswordDto: ChgPasswordDto,
  ): Promise<any> {
    // 找到用户
    const admin = await this.adminModel.findById(id).select('+password');
    // 校验密码
    const isValid = compareSync(chgPasswordDto.oldPassword, admin.password);
    if (!isValid) {
      throw new HttpException('原密码错误', HttpStatus.FORBIDDEN);
    } else {
      admin.password = chgPasswordDto.newPassword;
      admin.save();
      return { success: true };
    }
  }
}
