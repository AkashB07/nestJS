import { Module } from '@nestjs/common';
import { ListGroupsService } from './services/list-groups.service';
import { ListManagementController } from './list-management.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListItemsService } from './services/list-items.service';
import { ListGroup } from './entities/list-group.entity';
import { ListItem } from './entities/list-item.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ListGroup, ListItem]),
  ],
  controllers: [ListManagementController],
  providers: [ListGroupsService, ListItemsService],
  exports: [ListItemsService],
})
export class ListManagementModule {}
