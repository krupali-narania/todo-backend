import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';

import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  // ✅ CREATE TASK (ADMIN ONLY)
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(dto, req.user);
  }

  // ✅ GET TASKS (ALL / FILTERED)
  @Get()
  getTasks(@Req() req) {
    return this.tasksService.findAll(req.user);
  }

  // ✅ UPDATE STATUS (ASSIGNED USER ONLY)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req,
  ) {
    return this.tasksService.updateStatus(id, dto, req.user);
  }
}
