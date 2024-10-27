import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { BaseEntity } from 'src/common/base.entity';

@Entity()
export class Project extends BaseEntity {
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

  @Column({ default: false })
  isPrivate: boolean;

  @Column({ nullable: true })
  accessToken: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;
}
