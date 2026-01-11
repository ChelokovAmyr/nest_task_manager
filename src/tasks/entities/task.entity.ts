import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'Task ID' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Task title' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Task description', required: false })
  @Column({ type: 'text', nullable: true })
  description: string;

  @ApiProperty({
    description: 'Task priority',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  @Column({
    type: 'enum',
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  })
  priority: 'low' | 'medium' | 'high';

  @ApiProperty({
    description: 'Task status',
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  })
  @Column({
    type: 'enum',
    enum: ['todo', 'in_progress', 'done'],
    default: 'todo',
  })
  status: 'todo' | 'in_progress' | 'done';

  @ApiProperty({ description: 'Due date', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  dueDate: Date;

  @ApiProperty({ description: 'Creation date' })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  user_id: string;
}