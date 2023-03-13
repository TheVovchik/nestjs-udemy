import { Injectable, NotFoundException } from '@nestjs/common';
import { TasksRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './tasks-status.enum';
import { HttpException } from '@nestjs/common/exceptions';
import { HttpStatus } from '@nestjs/common/enums';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TasksRepository)
    private tasksRepository: TasksRepository,
  ) {}

  async getTaskById(id: string): Promise<Task> {
    const found = await this.tasksRepository.findOneBy({ id });

    if (!found) {
      // throw new NotFoundException(`Task with ID "${id}" not found`);
      throw new HttpException(
        { error: `Task with ID "${id}" not found` },
        HttpStatus.NOT_FOUND,
      );
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTask(id: string): Promise<void> {
    const result = await this.tasksRepository.delete(id);

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
  ): Promise<Task> {
    const currentTask = await this.getTaskById(id);
    const { status } = updateTaskStatusDto;

    currentTask.status = status;

    await this.tasksRepository.save(currentTask);

    return currentTask;
  }

  async getTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  // getTaskById(id: string): Task {
  //   // try to get task
  //   const found = this.tasks.find((task) => task.id === id);
  //   // if not found, throw 404
  //   if (!found) {
  //     throw new NotFoundException();
  //   }
  //   //otherwise, return task
  //   return found;
  // }
  // getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
  //   const { status, search } = filterDto;
  //   // define a temporary array to hold the result
  //   let tasks = this.getAllTasks();
  //   // do something with status
  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }
  //   // do something with search
  //   if (search) {
  //     tasks = tasks.filter((task) => {
  //       if (task.title.includes(search) || task.description.includes(search)) {
  //         return true;
  //       }
  //       return false;
  //     });
  //   }
  //   // return result
  //   return tasks;
  // }
  // getAllTasks(): Task[] {
  //   return this.tasks;
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
}
