// backend/src/users/user.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    BeforeInsert,
    OneToMany,
  } from 'typeorm';
  import * as bcrypt from 'bcrypt';
  import { Project } from '../projects/project.entity';
  
  export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
  }
  
  @Entity()
  export class User {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    @Column({
      type: 'enum',
      enum: UserRole,
      default: UserRole.USER,
    })
    role: UserRole;
  
    @OneToMany(() => Project, (project) => project.createdBy)
    projects: Project[];
  
    @BeforeInsert()
    async hashPassword() {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }
  