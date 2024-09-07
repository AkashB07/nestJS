import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { IQueryPagination } from 'src/common/interfaces/query.interface';
import {
  getPaginationObject,
  getSkipAndLimitFromQuery,
} from 'src/common/utils/pagination.util';
import { Repository } from 'typeorm';
import { CreateListItemDto } from '../dto/create-list-item.dto';
import { FindListItemByGroupDTO } from '../dto/find-list-by-group-code.dto';
import { UpdateListItemDto } from '../dto/update-list-item.dto';
import { ListItem } from '../entities/list-item.entity';
import { ListGroupsService } from './list-groups.service';
import { IFindItem } from '../interfaces/list-management.interface';
import { TypeormOrderByEnum } from 'src/common/enum/filter.enum';

@Injectable()
export class ListItemsService {

  constructor(
    @InjectRepository(ListItem)
    private listItemRepository: Repository<ListItem>,
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
      group: listGroup,
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
    const listItem = await this.listItemRepository.save(listItemData);
    return this.findById(listItem.id);
  }

  async findById(id: number) {
    const listItem = await this.listItemRepository.findOne({
      where: { id: id },
      relations: ['group'],
    });
    if (!listItem) {
      throw new HttpException('List Item Not Found', HttpStatus.NOT_FOUND);
    }
    return listItem;
  }

  async findAllByGroupId(groupId: number) {
    await this.listGroupsService.findById(groupId);
    const [listItems, totalCount] = await this.listItemRepository
      .createQueryBuilder('list_item')
      .select(['list_item.id', 'list_item.text', 'list_item.is_active'])
      .where('list_item.group_id = :groupId', { groupId })
      .orderBy('list_item.text', TypeormOrderByEnum.ASCENDING)
      .getManyAndCount();
    return { listItems, totalCount };
  }

  async findOneListItem(searchQuery): Promise<ListItem> {
    const { item_name, group_name, id } = searchQuery;
    const query = await this.listItemRepository
      .createQueryBuilder('list_item')
      .leftJoin('list_item.group', 'group')
      .addSelect(['group.id', 'group.text', 'group.code']);
    if (id) query.andWhere('list_item.id = :id', { id });
    if (item_name) query.andWhere('list_item.text = :item_name', { item_name });
    if (group_name) {
      query.andWhere('LOWER(TRIM(group.text)) = LOWER(TRIM(:group_name))', {
        group_name,
      });
    }
    return await query.getOne();
  }

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
    const updadeData: any = {
      ...updateListItemDto,
      updated_by: user_id,
    }
    await this.listItemRepository.update(id, updadeData);
    return await this.findById(id);
  }

  async remove(id: number, user_id: string) {
    const deletedListGroup = await this.listItemRepository.delete(id);
    if (!deletedListGroup.affected) {
      throw new HttpException('List Item Not Found', HttpStatus.NOT_FOUND);
    }
    return;
  }

  async findAllByGroup(findListItemByGroupDTO: FindListItemByGroupDTO) {
    const { group_code, search_text = '', id } = findListItemByGroupDTO;
    const { skip, limit } = getSkipAndLimitFromQuery(findListItemByGroupDTO);

    let listGroup;
    if (group_code)
      listGroup = await this.listGroupsService.findOne({ group_code });

    const query = await this.listItemRepository
      .createQueryBuilder('list_item')
      .select(['list_item.id', 'list_item.text', 'list_item.is_active']);
    if (listGroup)
      query.where('list_item.group_id = :group_id', { group_id: listGroup.id });

    if (id) query.andWhere('list_item.id = :id', { id });

    if (search_text)
      query.andWhere('(list_item.text ILIKE :text)', {
        text: `%${search_text}%`,
      });

    query
      .skip(skip)
      .take(limit)
      .orderBy('list_item.text', TypeormOrderByEnum.ASCENDING);
    const [listItems, page_count] = await query.getManyAndCount();
    const pagination: IQueryPagination = getPaginationObject(
      skip,
      limit,
      page_count,
    );
    return { listItems, pagination };
  }

  async findAllListItems() {
    const query = await this.listItemRepository
      .createQueryBuilder('list_item')
      .leftJoin('list_item.group', 'group')
      .addSelect(['group.id'])
      .orderBy('list_item.id', TypeormOrderByEnum.ASCENDING);
    return await query.getMany();
  }

  async findOne(findListGroup: IFindItem): Promise<any> {
    const { group, text } = findListGroup;
    const query = await this.listItemRepository.createQueryBuilder('list_item');
    if (group)
      query.andWhere('list_item.group = :group', {
        group,
      });
    if (text)
      query.andWhere('list_item.text = :text', {
        text,
      });

    return await query.getOne();
  }
}
