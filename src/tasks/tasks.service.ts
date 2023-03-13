import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';

@Injectable()
export class TasksService {
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
  // updateTaskStatus(id: string, updateTaskStatusDto: UpdateTaskStatusDto): Task {
  //   const currentTask = this.getTaskById(id);
  //   const { status } = updateTaskStatusDto;
  //   if (currentTask) {
  //     currentTask.status = status;
  //   }
  //   return currentTask;
  // }
  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }
}
