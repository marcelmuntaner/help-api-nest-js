import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UsersHelpPagesEntity } from 'src/users/users-help_pages.entity';

@Entity()
export class HelpPageEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  banner: string;

  @Column()
  sections: string;

  @Column()
  content: string;

  @OneToMany(
    () => UsersHelpPagesEntity,
    (usersHelpPage) => usersHelpPage.help_page,
  )
  users_include: UsersHelpPagesEntity[];
}
