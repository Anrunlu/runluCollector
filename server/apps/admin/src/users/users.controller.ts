import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { User } from '@libs/db/models/user.model';

@Controller('users')
@ApiTags('用户管理')
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: '显示用户列表' })
  findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '显示用户详情' })
  detail(@Param('id') id: string): Promise<User> {
    return this.usersService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建用户' })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Post('/createMany')
  @ApiOperation({ summary: '批量创建用户' })
  createMany(@Body() createUserDto: CreateUserDto[]): Promise<any> {
    return this.usersService.createMany(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改用户信息' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: CreateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  remove(@Param('id') id: string): Promise<any> {
    return this.usersService.remove(id);
  }
}