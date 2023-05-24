import { Injectable } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string, user: User): Promise<Task> {
    const found = await this.tasksRepository.findOne({
      where: {
        id,
        user,
      },
    });

    if (!found) {
      // throw new NotFoundException(`Task with ID "${id}" not found`);
      throw new HttpException(
        { error: `Task with ID "${id}" not found` },
        HttpStatus.NOT_FOUND,
      );
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const result = await this.tasksRepository.delete({ id, user });

    if (result.affected === 0) {
      // throw new NotFoundException(`Task with ID "${id}" not found`);
      throw new HttpException(
        { error: `Task with ID "${id}" not found` },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateTaskStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    const currentTask = await this.getTaskById(id, user);
    const { status } = updateTaskStatusDto;

    currentTask.status = status;

    await this.tasksRepository.save(currentTask);

    return currentTask;
  }

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto, user);
  }
}
