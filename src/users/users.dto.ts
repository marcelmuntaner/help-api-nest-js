import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ROLE } from '../common/role.enum';
import { PERMISSIONS } from 'src/common/permissions.enum';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}

export class GetUsersFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}

export class UpdateUserDto {
  @IsEnum(ROLE)
  role: ROLE;
}

export class UserToHelpPageDTO {
  @IsNotEmpty()
  @IsUUID()
  user: string;
  @IsNotEmpty()
  @IsUUID()
  help_page: string;
  @IsNotEmpty()
  @IsEnum(PERMISSIONS)
  permissions: PERMISSIONS;
}
