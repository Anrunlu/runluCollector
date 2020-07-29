import {
  Controller,
  Get,
  Param,
  Delete,
  Put,
  Body,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AdminsService } from './admins.service';
import { ApiOperation, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { Admin } from '@libs/db/models/admin.model';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('admins')
@ApiTags('管理员管理')
@UseGuards(AuthGuard('UserJwt'))
@ApiBearerAuth()
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Get()
  @ApiOperation({ summary: '显示管理员列表' })
  findAll(): Promise<Admin[]> {
    return this.adminsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '显示管理员详情' })
  detail(@Param('id') id: string): Promise<Admin> {
    return this.adminsService.detail(id);
  }

  @Post()
  @ApiOperation({ summary: '创建管理员' })
  create(@Body() createAdminDto: CreateAdminDto): Promise<Admin> {
    return this.adminsService.create(createAdminDto);
  }

  @Post('/createMany')
  @ApiOperation({ summary: '批量创建管理员' })
  createMany(@Body() createManyDto: CreateAdminDto[]): Promise<any> {
    return this.adminsService.createMany(createManyDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '修改管理员信息' })
  update(
    @Param('id') id: string,
    @Body() updateAdminDto: CreateAdminDto,
  ): Promise<Admin> {
    return this.adminsService.update(id, updateAdminDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除管理员' })
  remove(@Param('id') id: string): Promise<any> {
    return this.adminsService.remove(id);
  }
}
