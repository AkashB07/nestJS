import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersQueryDTO } from './dto/find-all-users.dto';
import { IQueryPagination } from 'src/common/interfaces/query.interface';
import { UpdateUserDto } from './dto/update-user.dto';
import { hashData } from '../auth/utils/auth.util';
import {
  FilterStatusDefaultEnum,
  SortByDefaultEnum,
  TypeormOrderByEnum,
} from 'src/common/enum/filter.enum';
import { Messages } from 'src/common/constants/message.constant';
import { BulkActiveInActiveDto } from 'src/common/dto/bulk-active-inactive.dto';
import { ConfigService } from '@nestjs/config';
import {
  getPaginationObject,
  getSkipAndLimitFromQuery,
} from 'src/common/utils/pagination.util';
import { PrismaService } from 'prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) { }

  async create(userDto: CreateUserDto, userId: string) {
    const insertData: any = {
      ...userDto,
      created_by: userId,
    };
    const user = await this.findByEmail(userDto.email);
    if (user) {
      throw new HttpException(Messages.EMAIL_EXISTS, HttpStatus.NOT_FOUND);
    }

    const result = await this.prisma.user.create({
      data: insertData,
    });
    this.eventEmitter.emit('user.created', { user: result });
    return this.findById(result.id);
  }

  async findAll(findAllUsersQueryDTO: FindAllUsersQueryDTO): Promise<any> {
    const { skip, limit } = getSkipAndLimitFromQuery(findAllUsersQueryDTO);
    const { search_text = '', sort_by, status } = findAllUsersQueryDTO;

    const orderBy =
      sort_by === SortByDefaultEnum.OLDEST
        ? TypeormOrderByEnum.ASCENDING
        : TypeormOrderByEnum.DESCENDING;

    const users = await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: orderBy,
      },
      where: {
        AND: [
          search_text
            ? {
              OR: [
                { name: { contains: search_text, mode: 'insensitive' } },
                { email: { contains: search_text, mode: 'insensitive' } },
                { phone_no: { contains: search_text, mode: 'insensitive' } },
              ],
            }
            : {},
          status
            ? { is_active: status === FilterStatusDefaultEnum.ACTIVE }
            : {},
        ],
      },
    });

    const totalCount = await this.prisma.user.count({
      where: {
        AND: [
          search_text
            ? {
              OR: [
                { name: { contains: search_text, mode: 'insensitive' } },
                { email: { contains: search_text, mode: 'insensitive' } },
                { phone_no: { contains: search_text, mode: 'insensitive' } },
              ],
            }
            : {},
          status
            ? { is_active: status === FilterStatusDefaultEnum.ACTIVE }
            : {},
        ],
      },
    });

    const pagination: IQueryPagination = getPaginationObject(
      skip,
      limit,
      totalCount,
    );
    return { users, pagination, filters: { status } };
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        phone_no: true,
        is_active: true,
        is_verified: true,
        is_super_user: true,
        password_hash: true,
      },
    });
  }

  async validateAndFindOneUserByEmail(email: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new HttpException(Messages.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user.is_active) {
      throw new HttpException(Messages.USER_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, userId: string) {
    const user = await this.findByEmail(updateUserDto.email);
    if (user && user.id != id) {
      throw new HttpException(Messages.EMAIL_EXISTS, HttpStatus.NOT_FOUND);
    }

    const udpateUserData: any = {
      ...updateUserDto,
      id: id,
      updated_by: userId,
    };

    const result = await this.prisma.user.update({
      where: { id },
      data: {
        ...udpateUserData,
      },
    });
    return this.findById(id);
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: {
        password_hash: passwordHash,
        is_verified: true,
      }
    });
  }

  async updateOne(id: string, updateQuery) {
    return this.prisma.user.update({
      where: { id },
      data: updateQuery,
    });
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);
    await this.prisma.user.delete({
      where: { id },
    });
    return;
  }

  // async validateUser(user) {
  //   if (!user) {
  //     throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);
  //   }
  //   if (!user.is_active) {
  //     throw new HttpException(Messages.USER_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
  //   }
  //   return true;
  // }

  async createSuperUser(userData: any) {
    const res = await this.findByEmail(userData.email);
    if (res) {
      throw new HttpException(Messages.EMAIL_EXISTS, HttpStatus.NOT_FOUND);
    }
    const user = await this.prisma.user.create({
      data: userData,
    });
    return this.findById(user.id);
  }

  async sendInvite(id: string): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    if (user && user.is_verified === false) {
      this.eventEmitter.emit('user.created', { user });
    }
    return user;
  }

  async updateRefreshToken(id: string, refresh_token: string) {
    const updateQuery = {};
    if (refresh_token) {
      refresh_token = await hashData(refresh_token);
      updateQuery['last_signed_in'] = new Date();
    }
    updateQuery['refresh_token'] = refresh_token;
    this.updateOne(id, updateQuery);
    return;
  }

  async updateBulkActiveInactive(
    bulkActiveInActiveDto: BulkActiveInActiveDto,
    userId: string,
  ) {
    const updateData: any = {
      is_active: bulkActiveInActiveDto.is_active,
      updated_by: userId,
    };
    let result = await this.prisma.user
      .updateMany({
        where: {
          id: {
            in: bulkActiveInActiveDto.ids, // Use 'in' to match multiple IDs
          },
        },
        data: updateData, // Specify the update data
      });
    if (!result) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return;
  }
}
