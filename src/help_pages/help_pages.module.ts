import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HelpPagesController } from './help_pages.controller';
import { HelpPagesService } from './help_pages.service';
import { HelpPageEntity } from './help_page.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersHelpPagesEntity } from 'src/users/users-help_pages.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([HelpPageEntity, UsersHelpPagesEntity]),
    AuthModule,
  ],
  providers: [HelpPagesService, UsersService],
  controllers: [HelpPagesController],
})
export class HelpPagesModule {}
