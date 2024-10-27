import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  BaseEntity as TBaseEntity,
} from 'typeorm';

export class BaseEntity extends TBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;
}
