import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entities/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { UsersService } from 'src/users/users.service';
import { Role } from 'src/common/enums/role.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    private usersService: UsersService,
  ) {}

  // ✅ CREATE TASK (ADMIN)
  async createTask(dto: CreateTaskDto, user: any) {
    // check assigned user exists
    const assignedUser = await this.usersService.findOne(dto.assignedTo);
    if (!assignedUser) {
      throw new NotFoundException('Assigned user not found');
    }

    const task = new this.taskModel({
      ...dto,
      assignedTo: dto.assignedTo,
      createdBy: user.userId, // from JWT
    });

    return task.save();
  }

  // ✅ GET TASKS (ROLE BASED)
  async findAll(user: any) {
    if (user.role === Role.ADMIN) {
      return this.taskModel
        .find()
        .populate('assignedTo createdBy', '-password');
    }

    return this.taskModel
      .find({ assignedTo: user.userId })
      .populate('assignedTo createdBy', '-password');
  }

  // ✅ UPDATE STATUS (ONLY ASSIGNED USER)
  async updateStatus(id: string, dto: UpdateTaskStatusDto, user: any) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // check ownership
    if (task.assignedTo.toString() !== user.userId) {
      throw new ForbiddenException('You cannot update this task');
    }

    task.status = dto.status;
    return task.save();
  }
}
