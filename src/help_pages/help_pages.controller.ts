import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { HelpPagesService } from './help_pages.service';
import { HelpPageEntity } from './help_page.entity';
import {
  CreateHelpPageDto,
  GetHelpPagesFilterDto,
  UpdateHelpPageDto,
} from './help_pages.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/role.guard';
import {
  PermissionsDecorator,
  RoleDecorator,
} from 'src/common/custom.decorators';
import { PermissionsGuard } from 'src/common/permissions.guard';

@Controller('help_pages')
@UseGuards(AuthGuard(), RoleGuard, PermissionsGuard)
export class HelpPagesController {
  constructor(private help_pagesService: HelpPagesService) {}

  @Get()
  @RoleDecorator('ADMIN')
  getHelpPages(
    @Query() filterDto: GetHelpPagesFilterDto,
  ): Promise<HelpPageEntity[]> {
    return this.help_pagesService.findAllFilt(filterDto);
  }

  @Get('/:id')
  @PermissionsDecorator('VIEWER')
  getHelpPageById(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<HelpPageEntity> {
    return this.help_pagesService.getHelpPageById(id);
  }

  @Post()
  @RoleDecorator('ADMIN')
  createHelpPage(
    @Body() createHelpPageDto: CreateHelpPageDto,
  ): Promise<HelpPageEntity> {
    return this.help_pagesService.createHelpPage(createHelpPageDto);
  }

  @Delete('/:id')
  @PermissionsDecorator('EDITOR')
  deleteHelpPage(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.help_pagesService.deleteHelpPage(id);
  }

  @Patch('/:id')
  @PermissionsDecorator('EDITOR')
  updateHelpPage(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateHelpPageDto: UpdateHelpPageDto,
  ): Promise<HelpPageEntity> {
    const { title, banner, sections, content } = updateHelpPageDto;
    return this.help_pagesService.updateHelpPage(
      id,
      title,
      banner,
      sections,
      content,
    );
  }
}
