import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { TasksService } from './tasks.service';

@ApiTags('Tasks')
@ApiBearerAuth('JWT-auth')
@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @ApiOperation({ summary: 'Create a task (admin only)' })
  @ApiBody({ type: CreateTaskDto })
  @ApiOkResponse({ description: 'Task created successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({ description: 'Admin role required' })
  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateTaskDto, @Req() req) {
    return this.tasksService.createTask(dto, req.user);
  }

  @ApiOperation({ summary: 'Get tasks for authenticated user' })
  @ApiOkResponse({ description: 'Tasks fetched successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @Get()
  getTasks(@Req() req) {
    return this.tasksService.findAll(req.user);
  }

  @ApiOperation({ summary: 'Update task status' })
  @ApiBody({ type: UpdateTaskStatusDto })
  @ApiOkResponse({ description: 'Task status updated successfully' })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid token' })
  @ApiForbiddenResponse({
    description: 'Only the assigned user can update status',
  })
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTaskStatusDto,
    @Req() req,
  ) {
    return this.tasksService.updateStatus(id, dto, req.user);
  }
}
