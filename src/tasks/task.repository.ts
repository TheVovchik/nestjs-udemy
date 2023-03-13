import { Injectable } from '@nestjs/common/decorators';
import { DataSource, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TaskStatus } from './tasks-status.enum';

@Injectable()
export class TasksRepository extends Repository<Task> {
  constructor(private dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto) {
    const { title, description } = createTaskDto;
    const task = this.create({
      title,
      description,
      status: TaskStatus.OPEN,
    });

    await this.save(task);

    return task;
  }

  async getTasks(fiterDto: GetTasksFilterDto): Promise<Task[]> {
    const query = this.createQueryBuilder('task');
    const { status, search } = fiterDto;

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'LOWER(task.title) LIKE :search or LOWER(task.description) LIKE :search',
        { search: `%${search.toLowerCase()}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }
}
