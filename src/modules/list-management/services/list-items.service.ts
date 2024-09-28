import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IQueryPagination } from 'src/common/interfaces/query.interface';
import {
  getPaginationObject,
  getSkipAndLimitFromQuery,
} from 'src/common/utils/pagination.util';
import { CreateListItemDto } from '../dto/create-list-item.dto';
import { FindListItemByGroupDTO } from '../dto/find-list-by-group-code.dto';
import { UpdateListItemDto } from '../dto/update-list-item.dto';
import { ListGroupsService } from './list-groups.service';
import { IFindItem } from '../interfaces/list-management.interface';
import { PrismaOrderByEnum } from 'src/common/enum/filter.enum';
import { PrismaService } from 'prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ListItemsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly listGroupsService: ListGroupsService,
    protected moduleRef: ModuleRef,
  ) { }

  async create(
    groupId: number,
    createListItemDto: CreateListItemDto,
    user_id: string,
  ) {
    const listGroup = await this.listGroupsService.findById(groupId);
    const listItemData = {
      ...createListItemDto,
      group: {
        connect: { id: listGroup.id },
      },
      // created_byId : user_id,
      created_by: {
        connect: { id: user_id },
      },
    };
    const res = await this.findOne({
      group: groupId,
      text: createListItemDto.text,
    });
    if (res)
      throw new HttpException(
        `List Item ${createListItemDto.text} already present in List Group ${listGroup.text}`,
        HttpStatus.NOT_FOUND,
      );
    const listItem = await this.prisma.listItem.create({
      data: listItemData,
    });
    return this.findById(listItem.id);
  }

  async findById(id: number) {
    const listItem = await this.prisma.listItem.findUnique({
      where: { id: id },
      include: { group: true },
    });

    if (!listItem) {
      throw new HttpException('List Item Not Found', HttpStatus.NOT_FOUND);
    }
    return listItem;
  }

  async findAllByGroupId(groupId: number) {
    await this.listGroupsService.findById(groupId);

    const listItems = await this.prisma.listItem.findMany({
      where: {
        group_id: groupId,
      },
      orderBy: {
        text: PrismaOrderByEnum.ASCENDING,
      },
    });

    // Get the total count
    const totalCount = await this.prisma.listItem.count({
      where: {
        group_id: groupId,
      },
    });

    return { listItems, totalCount };
  }

  //   async findOneListItem(searchQuery): Promise<ListItem> {
  //     const { item_name, group_name, id } = searchQuery;
  //     const query = await this.listItemRepository
  //       .createQueryBuilder('list_item')
  //       .leftJoin('list_item.group', 'group')
  //       .addSelect(['group.id', 'group.text', 'group.code']);
  //     if (id) query.andWhere('list_item.id = :id', { id });
  //     if (item_name) query.andWhere('list_item.text = :item_name', { item_name });
  //     if (group_name) {
  //       query.andWhere('LOWER(TRIM(group.text)) = LOWER(TRIM(:group_name))', {
  //         group_name,
  //       });
  //     }
  //     return await query.getOne();
  //   }

  // async findByItemNames(searchQuery) {
  //   const { item_names, group_name, Ids } = searchQuery
  //   const query = await this.listItemRepository
  //     .createQueryBuilder('list_item')
  //     .leftJoin('list_item.group', 'group')
  //     .addSelect(['group.id', 'group.text', 'group.code']);
  //   if (item_names) {
  //     query.andWhere('TRIM(list_item.text) IN (:...item_names)', { item_names })
  //   }
  //   if (group_name) {
  //     query.andWhere('LOWER(TRIM(group.text)) = LOWER(TRIM(:group_name))', {
  //       group_name,
  //     });
  //   }
  //   if (Ids) {
  //     query.andWhere('list_item.id IN (:...Ids)', { Ids })
  //   }

  //   return query.getMany();
  // }

  async update(
    id: number,
    updateListItemDto: UpdateListItemDto,
    user_id: string,
  ) {
    const list = await this.findById(id);
    const res = await this.findOne({
      group: list.group.id,
      text: updateListItemDto.text,
    });
    if (res && res.id !== id)
      throw new HttpException(
        `List Item ${updateListItemDto.text} already present in List Group ${list.group.text}`,
        HttpStatus.NOT_FOUND,
      );
    const updateData: any = {
      ...updateListItemDto,
      updated_by: {
        connect: { id: user_id },
      },
    }
    await this.prisma.listItem.update({
      where: { id },
      data: updateData,
    });
    return await this.findById(id);
  }

  async remove(id: number) {
    await this.findById(id);
    await this.prisma.listItem.delete({
      where: { id },
    });
    return;
  }

  async findAllByGroup(findListItemByGroupDTO: FindListItemByGroupDTO) {
    const { group_code, search_text = '', id } = findListItemByGroupDTO;
    const { skip, limit } = getSkipAndLimitFromQuery(findListItemByGroupDTO);

    let groupFilter = {};
    if (group_code) {
      const listGroup = await this.listGroupsService.findOne({ group_code });
      if (listGroup) {
        groupFilter = { group_id: listGroup.id };
      }
    }

    const where: Prisma.ListItemWhereInput = {
      ...groupFilter,
      ...(id && { id: +id }),
      text: search_text ? { contains: search_text, mode: 'insensitive' } : undefined,
    };

    const listItems = await this.prisma.listItem.findMany({
      where,
      select: {
        id: true,
        text: true,
        is_active: true,
      },
      skip: skip,
      take: limit,
      orderBy: {
        text: PrismaOrderByEnum.ASCENDING,
      },
    });
    const page_count = await this.prisma.listItem.count({ where });

    const pagination: IQueryPagination = getPaginationObject(skip, limit, page_count);

    return { listItems, pagination };
  }

  async findAllListItems() {
    const listItems = await this.prisma.listItem.findMany({
      include: {
        group: true,
      },
      orderBy: {
        id: PrismaOrderByEnum.ASCENDING,
      },
    });

    return listItems;
  }

  async findOne(findListGroup: IFindItem): Promise<any> {
    const { group, text } = findListGroup;

    const listItem = await this.prisma.listItem.findFirst({
      where: {
        ...(group && { group: { id: group } }), // Use relation filter for group
        ...(text && { text: text }), // Standard condition for text
      },
    });

    return listItem;
  }
}
