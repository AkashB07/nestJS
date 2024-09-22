import { Module } from '@nestjs/common';
import { ListGroupsService } from './services/list-groups.service';
import { ListManagementController } from './list-management.controller';
import { ListItemsService } from './services/list-items.service';

@Module({
  controllers: [ListManagementController],
  providers: [ListGroupsService, ListItemsService],
  exports: [ListItemsService],
})
export class ListManagementModule {}
