import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateListGroupDto } from '../dto/create-list-group.dto';
import { FindListByGroupCodeDTO } from '../dto/find-list-by-group-code.dto';
import { UpdateListGroupDto } from '../dto/update-list-group.dto';
import slugify from 'slugify';
import { ModuleRef } from '@nestjs/core';
import { IFindGroup } from '../interfaces/list-management.interface';
import { TypeormOrderByEnum } from 'src/common/enum/filter.enum';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ListGroupsService {
  constructor(
    private readonly prisma: PrismaService,
    // protected moduleRef: ModuleRef,
  ) { }

  async create(createListGroupDto: CreateListGroupDto, user_id: string) {
    let insertData: any = {
      ...createListGroupDto,
      // created_by:  user_id
      created_by:  {
        connect: { id:  user_id }, // Use connect to link to the existing user
      },
    };
    insertData.code = slugify(createListGroupDto.text.trim(), { lower: true });
    const group = await this.find({ group_code: insertData.code });
    if (group)
      throw new HttpException(`List Group ${createListGroupDto.text} already present`, HttpStatus.NOT_FOUND);
    const listGroup = await this.prisma.listGroup.create({
      data: insertData,
    });
    return this.findById(listGroup.id);
  }

  //   async findAll() {
  //     const [listGroups, totalCount] =
  //       await this.listGroupRepository.findAndCount({
  //         order: { text: TypeormOrderByEnum.ASCENDING },
  //       });
  //     return { listGroups, totalCount };
  //   }


  async findById(id: number) {
    const listGroup = await this.prisma.listGroup.findUnique({
      where: { id: id },
    });

    if (!listGroup) {
      throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
    }

    return listGroup;
  }


  async findByCode(findListByGroupCodeDTO: FindListByGroupCodeDTO): Promise<any> {
    const listGroup = await this.prisma.listGroup.findUnique({
      where: {
        code: findListByGroupCodeDTO.groupCode,
      },
      include: {
        items: {
          select: {
            id: true,
            text: true,
            is_active: true,
          },
        },
      },
    });

    if (!listGroup) {
      throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
    }

    return { listItems: listGroup.items || [] };
  }


  //   async update(
  //     id: number,
  //     updateListGroupDto: UpdateListGroupDto,
  //     user_id: string,
  //   ) {
  //     let updateData: any = {
  //       ...updateListGroupDto,
  //       updated_by: user_id,
  //     };
  //     if (updateListGroupDto.text) {
  //       updateData.code = slugify(updateListGroupDto.text.trim(), { lower: true });
  //     }

  //     const group = await this.find({ group_code: updateData.code });
  //     if (group && group.id !== id)
  //       throw new HttpException(`List Group ${updateListGroupDto.text} already present`, HttpStatus.NOT_FOUND);

  //     await this.listGroupRepository.update(id, updateData);
  //     return await this.findById(id);
  //   }

  //   async remove(id: number, user_id: string) {
  //     const deletedListGroup = await this.listGroupRepository.delete(id);
  //     if (!deletedListGroup.affected) {
  //       throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
  //     }
  //     return;
  //   }

  //   async findOne(findListGroupDTO): Promise<any> {
  //     const { group_code } = findListGroupDTO;
  //     const listGroup = await this.listGroupRepository
  //       .createQueryBuilder('list_group')
  //       .where('list_group.code = :code', {
  //         code: group_code,
  //       })
  //       .getOne();
  //     if (!listGroup)
  //       throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
  //     return listGroup;
  //   }


  async find(findListGroup: IFindGroup): Promise<any> {
    const { group_code } = findListGroup;

    const listGroup = await this.prisma.listGroup.findUnique({
      where: {
        code: group_code,
      },
    });

    return listGroup;
  }
}
