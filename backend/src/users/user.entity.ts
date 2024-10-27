import { Entity, Column, OneToMany } from 'typeorm';
import { Project } from '../projects/project.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 100 })
  name: string;

  @Column({ unique: true })
  email: string;

  @OneToMany(() => Project, (project) => project.user)
  projects: string[];
}
