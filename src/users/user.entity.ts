import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ROLE } from '../common/role.enum';
import { UsersHelpPagesEntity } from './users-help_pages.entity';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  role: ROLE;

  @OneToMany(
    () => UsersHelpPagesEntity,
    (usersHelpPage) => usersHelpPage.user,
    { eager: true },
  )
  help_pages_include: UsersHelpPagesEntity[];
}
