// backend/src/projects/project.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { User } from '../users/user.entity';
  
  @Entity()
  export class Project {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ length: 100 })
    name: string;
  
    @Column({ nullable: true })
    description: string;
  
    @Column()
    repositoryUrl: string;
  
    @Column({ nullable: true })
    githubRepoId: number; // GitHub repository ID
  
    @Column({ nullable: true })
    webhookSecret: string; // Secret for verifying GitHub webhooks
  
    @Column({ default: false })
    isWebhookActive: boolean;
  
    @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'createdBy' })
    createdBy: User;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  