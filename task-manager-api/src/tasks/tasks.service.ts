import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto, PaginatedResponse } from '../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: string): Promise<Task> {
    const task = this.tasksRepository.create({
      ...createTaskDto,
      user_id: userId,
    });

    return await this.tasksRepository.save(task);
  }

  async findAll(
    userId: string,
    status?: string,
    priority?: string,
    search?: string,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
    pagination?: PaginationDto,
  ): Promise<Task[] | PaginatedResponse<Task>> {
    const query = this.tasksRepository
      .createQueryBuilder('task')
      .where('task.user_id = :userId', { userId });

    if (status) {
      const validStatuses = ['todo', 'in_progress', 'done'];
      if (!validStatuses.includes(status)) {
        throw new BadRequestException(
          `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        );
      }
      query.andWhere('task.status = :status', { status });
    }

    if (priority) {
      const validPriorities = ['low', 'medium', 'high'];
      if (!validPriorities.includes(priority)) {
        throw new BadRequestException(
          `Invalid priority. Must be one of: ${validPriorities.join(', ')}`,
        );
      }
      query.andWhere('task.priority = :priority', { priority });
    }

    if (search) {
      query.andWhere(
        '(task.title ILIKE :search OR task.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    const orderBy = sortBy || 'createdAt';
    const order = sortOrder || 'DESC';
    const validSortFields = ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'];
    if (!validSortFields.includes(orderBy)) {
      throw new BadRequestException(
        `Invalid sort field. Must be one of: ${validSortFields.join(', ')}`,
      );
    }

    query.orderBy(`task.${orderBy}`, order);

    // If pagination is provided, return paginated results
    if (pagination) {
      const page = pagination.page || 1;
      const limit = pagination.limit || 10;
      const skip = (page - 1) * limit;

      const [tasks, total] = await query
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      const totalPages = Math.ceil(total / limit);

      return {
        data: tasks,
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      };
    }

    // Otherwise return all tasks
    return await query.getMany();
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.tasksRepository.findOne({
      where: { id, user_id: userId },
    });

    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);

    Object.assign(task, updateTaskDto);

    return await this.tasksRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user_id: userId });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async getStats(userId: string) {
    const [statusStats, priorityStats, overdueCount] = await Promise.all([
      // Status statistics
      this.tasksRepository
        .createQueryBuilder('task')
        .select('task.status', 'status')
        .addSelect('COUNT(task.id)', 'count')
        .where('task.user_id = :userId', { userId })
        .groupBy('task.status')
        .getRawMany(),

      // Priority statistics
      this.tasksRepository
        .createQueryBuilder('task')
        .select('task.priority', 'priority')
        .addSelect('COUNT(task.id)', 'count')
        .where('task.user_id = :userId', { userId })
        .groupBy('task.priority')
        .getRawMany(),

      // Overdue tasks count
      this.tasksRepository
        .createQueryBuilder('task')
        .where('task.user_id = :userId', { userId })
        .andWhere('task.dueDate < :now', { now: new Date() })
        .andWhere('task.status != :done', { done: 'done' })
        .getCount(),
    ]);

    const statusCounts = statusStats.reduce((acc, stat) => {
      acc[stat.status] = parseInt(stat.count, 10);
      return acc;
    }, {} as Record<string, number>);

    const priorityCounts = priorityStats.reduce((acc, stat) => {
      acc[stat.priority] = parseInt(stat.count, 10);
      return acc;
    }, {} as Record<string, number>);

    const total = await this.tasksRepository.count({
      where: { user_id: userId },
    });

    return {
      total,
      byStatus: {
        todo: statusCounts.todo || 0,
        in_progress: statusCounts.in_progress || 0,
        done: statusCounts.done || 0,
      },
      byPriority: {
        low: priorityCounts.low || 0,
        medium: priorityCounts.medium || 0,
        high: priorityCounts.high || 0,
      },
      overdue: overdueCount,
    };
  }
}