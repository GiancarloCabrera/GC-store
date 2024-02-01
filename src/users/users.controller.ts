import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import User from './user.entity';
import { UpdateUSerDto } from './dto/update-user.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiSecurity('Api-Key')
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) { }

  @Get()
  getUsers(): Promise<User[]> {
    return this.usersService.getUsers();
  }

  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getUser(id);
  }

  @Post()
  createUser(@Body() newUser: CreateUserDto) {
    return this.usersService.createUser(newUser);
  }

  @Delete(':id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }

  @Put(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUSerDto,
  ) {
    return this.usersService.updateUser(id, user);
  }
}
