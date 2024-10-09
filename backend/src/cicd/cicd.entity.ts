// backend/src/cicd/cicd.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
  } from 'typeorm';
  import { Project } from '../projects/project.entity';
  
  export enum BuildStatus {
    SUCCESS = 'success',
    FAILURE = 'failure',
    IN_PROGRESS = 'in_progress',
    QUEUED = 'queued',
  }
  
  @Entity()
  export class CICDEvent {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;
  
    @Column()
    eventType: string; // e.g., 'push', 'pull_request', 'deployment'
  
    @Column({ type: 'enum', enum: BuildStatus })
    status: BuildStatus;
  
    @Column({ nullable: true })
    commitSha: string;
  
    @Column({ nullable: true })
    branch: string;
  
    @CreateDateColumn()
    createdAt: Date;
  }
  