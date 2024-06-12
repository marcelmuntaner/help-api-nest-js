import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/role.guard';
import {
  CreateUserDto,
  GetUsersFilterDto,
  UpdateUserDto,
  UserToHelpPageDTO,
} from './users.dto';
import { RoleDecorator } from 'src/common/custom.decorators';
import { UsersHelpPagesEntity } from './users-help_pages.entity';

@Controller('users')
@UseGuards(AuthGuard(), RoleGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @RoleDecorator('ADMIN')
  getUsers(@Query() filterDto: GetUsersFilterDto): Promise<UserEntity[]> {
    return this.usersService.findAllFilt(filterDto);
  }

  @Get('/:id')
  @RoleDecorator('ADMIN')
  getUserById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserEntity> {
    return this.usersService.findOne(id);
  }

  @Get('/:id/help_pages')
  @RoleDecorator('ADMIN')
  getUserHelpPages(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UsersHelpPagesEntity[]> {
    return this.usersService.getUserHelpPages(id);
  }

  @Post()
  @RoleDecorator('ADMIN')
  createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersService.createUser(createUserDto);
  }

  @Delete('/:id')
  @RoleDecorator('ADMIN')
  deleteUser(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.deleteUser(id);
  }

  @Patch('/:id')
  @RoleDecorator('ADMIN')
  updateUser(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    const { role } = updateUserDto;
    return this.usersService.updateUser(id, role);
  }

  @Post('/enable-help-page')
  @RoleDecorator('ADMIN')
  enableHelpPageToUser(
    @Body() body: UserToHelpPageDTO,
  ): Promise<UsersHelpPagesEntity> {
    return this.usersService.enableHelpPageToUser(body);
  }
}
