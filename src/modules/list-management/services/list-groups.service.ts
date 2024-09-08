// import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { CreateListGroupDto } from '../dto/create-list-group.dto';
// import { FindListByGroupCodeDTO } from '../dto/find-list-by-group-code.dto';
// import { UpdateListGroupDto } from '../dto/update-list-group.dto';
// import { ListGroup } from '../entities/list-group.entity';
// import slugify from 'slugify';
// import { ModuleRef } from '@nestjs/core';
// import { IFindGroup } from '../interfaces/list-management.interface';
// import { TypeormOrderByEnum } from 'src/common/enum/filter.enum';

// @Injectable()
// export class ListGroupsService {
//   constructor(
//     @InjectRepository(ListGroup)
//     private listGroupRepository: Repository<ListGroup>,
//     protected moduleRef: ModuleRef,
//   ) {}

//   async create(createListGroupDto: CreateListGroupDto, user_id: string) {
//     let insertData: any = {
//       ...createListGroupDto,
//       created_by: user_id,
//     };
//     insertData.code = slugify(createListGroupDto.text.trim(), { lower: true });
//     const group = await this.find({ group_code: insertData.code });
//     if (group)
//       throw new HttpException(`List Group ${createListGroupDto.text} already present`, HttpStatus.NOT_FOUND);
//     const listGroup = await this.listGroupRepository.save(insertData);
//     return this.findById(listGroup.id);
//   }

//   async findAll() {
//     const [listGroups, totalCount] =
//       await this.listGroupRepository.findAndCount({
//         order: { text: TypeormOrderByEnum.ASCENDING },
//       });
//     return { listGroups, totalCount };
//   }

//   async findById(id: number) {
//     const listGroup = await this.listGroupRepository.findOne({
//       where: { id: id },
//     });
//     if (!listGroup) {
//       throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
//     }
//     return listGroup;
//   }

//   async findByCode(
//     findListByGroupCodeDTO: FindListByGroupCodeDTO,
//   ): Promise<any> {
//     const listGroup = await this.listGroupRepository
//       .createQueryBuilder('list_group')
//       .where('list_group.code = :code', {
//         code: findListByGroupCodeDTO.groupCode,
//       })
//       .leftJoin('list_group.items', 'list_item')
//       .addSelect(['list_item.id', 'list_item.text', 'list_item.is_active'])
//       .getOne();
//     if (!listGroup) {
//       throw new HttpException('List Group Not Found', HttpStatus.NOT_FOUND);
//     }
//     return { listItems: listGroup.items || [] };
//   }

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

//   async find(findListGroup: IFindGroup): Promise<any> {
//     const { group_code } = findListGroup;
//     const query = await this.listGroupRepository
//       .createQueryBuilder('list_group');
//     if (group_code)
//       query.andWhere('list_group.code = :code', {
//         code: group_code,
//       })

//     return await query.getOne();
//   }
// }
