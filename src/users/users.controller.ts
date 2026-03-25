import { UseGuards, Get, Controller } from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UsersService } from './users.service';
import { Body, Post, Param } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  // ✅ CREATE USER (ADMIN ONLY)
  @Post()
  @Roles(Role.ADMIN)
  createUser(@Body() dto: CreateUserDto) {
    return this.usersService.createUser(dto);
  }

  // ✅ GET ALL USERS (ADMIN ONLY)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('admin')
  @Roles(Role.ADMIN) // ✅ ONLY ADMIN
  getAdminData() {
    return 'Only admin can access';
  }
  // ✅ GET USER BY ID (ADMIN ONLY)
  @Get(':id')
  @Roles(Role.ADMIN)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
