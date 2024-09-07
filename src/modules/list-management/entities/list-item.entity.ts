import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ListGroup } from './list-group.entity';
import { User } from 'src/modules/users/entities/user.entity';

@Entity()
export class ListItem extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: true })
  is_active: boolean;

  @ManyToOne(
    () => ListGroup,
    listGroup => listGroup.id,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: "group_id" })
  group: ListGroup;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;
}
