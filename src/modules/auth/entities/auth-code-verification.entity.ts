import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AuthCodeVerificationTypeEnum } from '../constants/auth.enum';

@Entity()
export class AuthCodeVerification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: AuthCodeVerificationTypeEnum,
  })
  type: AuthCodeVerificationTypeEnum;

  @Column({ nullable: true })
  code_hash: string;

  @Column({ nullable: true })
  user_id: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
