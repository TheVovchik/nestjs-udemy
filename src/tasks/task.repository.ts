import { Injectable } from '@nestjs/common/decorators';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';
import { HttpException, Logger } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';

@Injectable()
export class TasksRepository extends Repository<Task> {
  private logger = new Logger('TasksRepository', { timestamp: true });

  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: User) {
    const { title, description } = createTaskDto;
    const task = this.create({
      user,
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasks(fiterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    query.where({ user });
    const { status, search } = fiterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(LOWER(task.title) LIKE :search or LOWER(task.description) LIKE :search)',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (error) {
      this.logger.error(
        `Failed to get user "${user.username}" tasks. Filters: ${JSON.stringify(
          fiterDto,
        )}`,
        error.stack,
      );

      throw new HttpException(
        { error: `Failed to load user tasks` },
        HttpStatus.EXPECTATION_FAILED,
      );
    }
  }
}
