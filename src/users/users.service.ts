import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import * as bcrypt from 'bcrypt';
import { ROLE } from '../common/role.enum';
import {
  CreateUserDto,
  GetUsersFilterDto,
  UserToHelpPageDTO,
} from './users.dto';
import { UsersHelpPagesEntity } from './users-help_pages.entity';
import { HelpPageEntity } from 'src/help_pages/help_page.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UsersHelpPagesEntity)
    private readonly userHelpPageRepo: Repository<UsersHelpPagesEntity>,
    @InjectRepository(HelpPageEntity)
    private readonly helpPageRepo: Repository<HelpPageEntity>,
  ) {}

  async findUserAuth(username: string): Promise<UserEntity> {
    const found = await this.userRepo.findOneBy({ username });
    if (!found) {
      throw new NotFoundException('Please check your login credentials');
    }
    return found;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    return user;
  }

  async findAllFilt(filterDto: GetUsersFilterDto): Promise<UserEntity[]> {
    const query = this.userRepo.createQueryBuilder('user');
    if (filterDto.search) {
      query.andWhere(
        '(LOWER(user.username) LIKE LOWER(:search) OR LOWER(user.role) LIKE LOWER(:search))',
        { search: `%${filterDto.search}%` },
      );
    }
    const users = await query.getMany();
    return users;
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.userRepo.create({
      username,
      password: hashedPassword,
      role: ROLE.REGULAR,
    });
    try {
      await this.userRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        // duplicate username
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User with id "${id}" not found`);
    }
  }

  async updateUser(id: string, role: ROLE): Promise<UserEntity> {
    const user = await this.userRepo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    user.role = role;
    await this.userRepo.save(user);
    return user;
  }

  async enableHelpPageToUser(
    body: UserToHelpPageDTO,
  ): Promise<UsersHelpPagesEntity> {
    console.log('in enableHelpPageToUser service, body:', body);
    const user_found = await this.userRepo.findOneBy({ id: body.user });
    if (!user_found) {
      throw new NotFoundException(`User #${body.user} not found`);
    }
    const help_pg_found = await this.helpPageRepo.findOneBy({
      id: body.help_page,
    });
    if (!help_pg_found) {
      throw new NotFoundException(`Help Page #${body.help_page} not found`);
    }
    let user_help_page = await this.userHelpPageRepo.findOne({
      where: { user: user_found, help_page: help_pg_found },
    });
    if (user_help_page) {
      user_help_page.permissions = body.permissions;
    } else {
      user_help_page = this.userHelpPageRepo.create({
        user: user_found,
        help_page: help_pg_found,
        permissions: body.permissions,
      });
    }
    try {
      await this.userHelpPageRepo.save(user_help_page);
    } catch (error) {
      console.log('error:', error);
      throw new InternalServerErrorException();
    }
    return user_help_page;
  }

  async getUserHelpPages(id: string): Promise<UsersHelpPagesEntity[]> {
    const user = await this.userRepo.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const help_pages_user = user.help_pages_include;
    return help_pages_user;
  }

  async userHelpPagePermissions(
    user: UserEntity,
    help_page: HelpPageEntity,
  ): Promise<void> {
    const perm = await this.userHelpPageRepo
      .createQueryBuilder('userHelpPage')
      .where({ user: user, help_page: help_page })
      .leftJoinAndSelect('user.help_pages_include', 'permissions')
      .getOne();
    console.log('perm: ', perm);
    //const help_pages_user = user.help_pages_include;
    //return perm;
  }
}
