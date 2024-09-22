import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    HttpStatus,
    Res,
    UseGuards,
    Req,
    Query,
} from '@nestjs/common';
import { ListGroupsService } from './services/list-groups.service';
import { CreateListGroupDto } from './dto/create-list-group.dto';
import { UpdateListGroupDto } from './dto/update-list-group.dto';
import { ListItemsService } from './services/list-items.service';
import { CreateListItemDto } from './dto/create-list-item.dto';
import {
    FindListByGroupCodeDTO,
    FindListItemByGroupDTO,
} from './dto/find-list-by-group-code.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/passport/jwt/jwt.guard';
import { UpdateListItemDto } from './dto/update-list-item.dto';

@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('list-management')
export class ListManagementController {
    constructor(
        private readonly listGroupsService: ListGroupsService,
        private readonly listItemsService: ListItemsService,
    ) { }

    //   @Get('list/:groupCode')
    //   async findAllListItemsByGroupCode(
    //     @Res() res,
    //     @Param() findListByGroupCodeDTO: FindListByGroupCodeDTO,
    //   ) {
    //     const result = await this.listGroupsService.findByCode(
    //       findListByGroupCodeDTO,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'List Items',
    //       data: result,
    //     });
    //   }

    //   @Get('list-item')
    //   async findAllListItemsByGroup(
    //     @Res() res,
    //     @Query() findListItemByGroupDTO: FindListItemByGroupDTO,
    //   ) {
    //     const result = await this.listItemsService.findAllByGroup(
    //       findListItemByGroupDTO,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'List Items',
    //       data: result,
    //     });
    //   }

    @Post('groups')
    async createListGroup(
        @Req() req,
        @Res() res,
        @Body() createListGroupDto: CreateListGroupDto,
    ) {
        // try {
            const result = await this.listGroupsService.create(
                createListGroupDto,
                req.user.id,
            );
            return res.status(HttpStatus.CREATED).json({
                statusCode: HttpStatus.CREATED,
                message: 'Created List Group Successfully',
                data: { ...result },
            });

        // } catch (error) {
        //     console.log(error)
        // }
    }

    //   @Get('groups')
    //   async findAllListGroups(@Res() res) {
    //     const result = await this.listGroupsService.findAll();
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'List Groups',
    //       data: result,
    //     });
    //   }

    //   @Patch('groups/:id')
    //   async updateListGroup(
    //     @Req() req,
    //     @Res() res,
    //     @Param('id') id: string,
    //     @Body() updateListGroupDto: UpdateListGroupDto,
    //   ) {
    //     const result = await this.listGroupsService.update(
    //       +id,
    //       updateListGroupDto,
    //       req.user.id,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'Updated List Group Successfully',
    //       data: { ...result },
    //     });
    //   }

    //   @Delete('groups/:id')
    //   async removeListGroup(@Req() req, @Res() res, @Param('id') id: string) {
    //     await this.listGroupsService.remove(+id, req.user.id);
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'Deleted List Group Successfully',
    //       data: {},
    //     });
    //   }

    //   @Post('groups/:groupId/items')
    //   async createListItem(
    //     @Req() req,
    //     @Res() res,
    //     @Param('groupId') groupId: string,
    //     @Body() createListItemDto: CreateListItemDto,
    //   ) {
    //     const result = await this.listItemsService.create(
    //       +groupId,
    //       createListItemDto,
    //       req.user.id,
    //     );
    //     return res.status(HttpStatus.CREATED).json({
    //       statusCode: HttpStatus.CREATED,
    //       message: 'Created List Item Successfully',
    //       data: { ...result },
    //     });
    //   }

    //   @Get('groups/:groupId/items')
    //   async findAllListItemsByGroupId(
    //     @Res() res,
    //     @Param('groupId') groupId: string,
    //   ) {
    //     const result = await this.listItemsService.findAllByGroupId(+groupId);
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'List Items',
    //       data: result,
    //     });
    //   }

    //   @Patch('groups/:groupId/items/:itemId')
    //   async updateListItem(
    //     @Req() req,
    //     @Res() res,
    //     @Param('groupId') groupId: string,
    //     @Param('itemId') id: string,
    //     @Body() updateListItemDto: UpdateListItemDto,
    //   ) {
    //     const result = await this.listItemsService.update(
    //       +id,
    //       updateListItemDto,
    //       req.user.id,
    //     );
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'Updated List Item Successfully',
    //       data: { ...result },
    //     });
    //   }

    //   @Delete('groups/:groupId/items/:itemId')
    //   async removeListItem(
    //     @Req() req,
    //     @Res() res,
    //     @Param('groupId') groupId: string,
    //     @Param('itemId') id: string,
    //   ) {
    //     await this.listItemsService.remove(+id, req.user.id);
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'Deleted List Item Successfully',
    //       data: {},
    //     });
    //   }

    //   @Get('list-all/list-item')
    //   async findAllListItems(@Res() res) {
    //     const result = await this.listItemsService.findAllListItems();
    //     return res.status(HttpStatus.OK).json({
    //       statusCode: HttpStatus.OK,
    //       message: 'List Items',
    //       data: result,
    //     });
    //   }
}
