import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { PERMISSIONS } from '../common/permissions.enum';
import { UserEntity } from './user.entity';
import { HelpPageEntity } from 'src/help_pages/help_page.entity';

@Entity({ name: 'users_help_pages' })
export class UsersHelpPagesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: PERMISSIONS, default: PERMISSIONS.VIEWER })
  permissions: PERMISSIONS;

  @ManyToOne(() => UserEntity, (user) => user.help_pages_include)
  user: UserEntity;

  @ManyToOne(() => HelpPageEntity, (help_page) => help_page.users_include, {
    eager: true,
  })
  help_page: HelpPageEntity;
}
