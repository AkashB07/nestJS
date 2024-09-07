import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity';
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
import { InjectRepository } from '@nestjs/typeorm';
import { BulkActiveInActiveDto } from 'src/common/dto/bulk-active-inactive.dto';
import { ConfigService } from '@nestjs/config';
import {
  getPaginationObject,
  getSkipAndLimitFromQuery,
} from 'src/common/utils/pagination.util';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private eventEmitter: EventEmitter2,
    private configService: ConfigService,
  ) { }

  async create(userDto: CreateUserDto, userId: string) {
    const insertData: any = {
      ...userDto,
      created_by: userId,
    };
    const result = await this.usersRepository.save(insertData);
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

    const query = this.usersRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(limit)
      .orderBy('user.created_at', orderBy);

    if (search_text) {
      query.where(
        '(user.name ILIKE :text OR user.email ILIKE :text OR user.phone_no ILIKE :text)',
        {
          text: `%${search_text}%`,
        },
      );
    }

    if (status) {
      const isActive = status === FilterStatusDefaultEnum.ACTIVE ? true : false;
      query.andWhere('user.is_active = :isActive', { isActive });
    }

    const [users, totalCount] = await query.getManyAndCount();

    const pagination: IQueryPagination = getPaginationObject(
      skip,
      limit,
      totalCount,
    );
    return { users, pagination, filters: { status } };
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    if (!user) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password_hash')
      .where('user.email = :email', { email })
      .getOne();
  }

  async validateAndFindOneUserByEmail(email: string) {
    const user: any = await this.findByEmail(email);
    if (!user) {
      throw new HttpException(Messages.EMAIL_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user.is_active) {
      throw new HttpException(Messages.USER_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto, userId: string) {
    const udpateUserData: any = {
      ...updateUserDto,
      id: id,
      updated_by: userId,
    };
    await this.usersRepository.save(udpateUserData);
    return await this.findById(id);
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.usersRepository.update(id, {
      password_hash: passwordHash,
      is_verified: true,
    });
  }

  async updateOne(id: string, updateQuery) {
    return this.usersRepository.update(id, updateQuery);
  }

  async remove(id: string): Promise<void> {
    const deletedUser = await this.usersRepository.delete(id);
    if (!deletedUser.affected) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return;
  }

  async validateUser(user) {
    if (!user) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.BAD_REQUEST);
    }
    if (!user.is_active) {
      throw new HttpException(Messages.USER_NOT_ACTIVE, HttpStatus.BAD_REQUEST);
    }
    return true;
  }

  async createSuperUser(userData: any) {
    const user = await this.usersRepository.save(userData);
    return this.findById(user.id);
  }

  async sendInvite(id: string): Promise<User> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
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
    let result = await this.usersRepository.update(
      {
        id: In(bulkActiveInActiveDto.ids),
      },
      updateData,
    );
    if (!result.affected) {
      throw new HttpException(Messages.DATA_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
    return;
  }
}
