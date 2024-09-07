import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import {
  DomainNameDto,
  FindAllUsersQueryDTO,
  GetClientUserDto,
} from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAccessTokenGuard } from '../auth/passport/jwt/jwt.guard';
import { BulkActiveInActiveDto } from 'src/common/dto/bulk-active-inactive.dto';
import { Messages } from 'src/common/constants/message.constant';

@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Req() req, @Res() res, @Body() userDto: CreateUserDto) {
    const result = await this.usersService.create(userDto, req.user?.id);
    return res.status(HttpStatus.CREATED).json({
      statusCode: HttpStatus.CREATED,
      message: Messages.CREATE_SUCCESS,
      data: { ...result },
    });
  }

  @Get()
  async findAll(
    @Res() res,
    @Query() findAllUsersQueryDTO: FindAllUsersQueryDTO,
  ) {
    const result = await this.usersService.findAll(findAllUsersQueryDTO);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.DATA_FOUND,
      data: result,
    });
  }

  @Get(':id')
  async findOne(@Res() res, @Param('id') id: string) {
    const result = await this.usersService.findById(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.DATA_FOUND,
      data: { ...result },
    });
  }

  @Patch(':id')
  async update(
    @Req() req,
    @Res() res,
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const result = await this.usersService.update(
      id,
      updateUserDto,
      req.user?.id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.UPDATED_SUCCESS,
      data: { ...result },
    });
  }

  @Delete(':id')
  async remove(@Res() res, @Param('id') id: string) {
    await this.usersService.remove(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.DELETED_SUCCESS,
      data: {},
    });
  }

  @Get(':id/send-invite')
  async sendInvite(@Res() res, @Param('id') id: string) {
    const User = await this.usersService.sendInvite(id);
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.INVITE_SENT_SUCCESS,
      data: { ...User },
    });
  }

  @Patch('bulk/active-inactive')
  async bulkActiveInactive(
    @Req() req,
    @Res() res,
    @Body() bulkActiveInActiveDto: BulkActiveInActiveDto,
  ) {
    await this.usersService.updateBulkActiveInactive(
      bulkActiveInActiveDto,
      req.user?.id,
    );
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: Messages.UPDATED_SUCCESS,
      data: {},
    });
  }
}
