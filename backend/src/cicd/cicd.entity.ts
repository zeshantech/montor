// backend/src/cicd/cicd.entity.ts

import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../projects/project.entity';
import { BaseEntity } from 'src/common/base.entity';

export enum BuildStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  IN_PROGRESS = 'in_progress',
  QUEUED = 'queued',
}

@Entity()
export class CICDEvent extends BaseEntity {
  @ManyToOne(() => Project, (project) => project.id, { onDelete: 'CASCADE' })
  @JoinColumn()
  project: Project;

  @Column()
  eventType: string; // e.g., 'push', 'pull_request', 'deployment'

  @Column({ type: 'enum', enum: BuildStatus })
  status: BuildStatus;

  @Column({ nullable: true })
  commitSha: string;

  @Column({ nullable: true })
  branch: string;
}
