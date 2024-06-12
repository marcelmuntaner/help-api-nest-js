import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHelpPageDto, GetHelpPagesFilterDto } from './help_pages.dto';
import { HelpPageEntity } from './help_page.entity';

@Injectable()
export class HelpPagesService {
  constructor(
    @InjectRepository(HelpPageEntity)
    private readonly help_pageEntityRepository: Repository<HelpPageEntity>,
  ) {}

  async getHelpPageById(id: string): Promise<HelpPageEntity> {
    const found = await this.help_pageEntityRepository.findOneBy({ id });
    if (!found) {
      throw new NotFoundException(`HelpPage with ID "${id}" not found`);
    }
    return found;
  }

  async findAllFilt(
    filterDto: GetHelpPagesFilterDto,
  ): Promise<HelpPageEntity[]> {
    const { search } = filterDto;
    const query =
      this.help_pageEntityRepository.createQueryBuilder('help_page');
    if (search) {
      query.andWhere(
        '(LOWER(help_page.title) LIKE LOWER(:search) OR LOWER(help_page.content) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );
    }
    const help_pages = await query.getMany();
    return help_pages;
  }

  async createHelpPage(
    createHelpPageDto: CreateHelpPageDto,
  ): Promise<HelpPageEntity> {
    const { title, banner, sections, content } = createHelpPageDto;
    const help_page = this.help_pageEntityRepository.create({
      title,
      banner,
      sections,
      content,
    });
    await this.help_pageEntityRepository.save(help_page);
    return help_page;
  }

  async deleteHelpPage(id: string): Promise<void> {
    const result = await this.help_pageEntityRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`HelpPage with ID "${id}" not found`);
    }
  }

  async updateHelpPage(
    id: string,
    title: string,
    banner: string,
    sections: string,
    content: string,
  ): Promise<HelpPageEntity> {
    const help_page = await this.getHelpPageById(id);
    if (!help_page) {
      throw new NotFoundException(`HelpPage with ID "${id}" not found`);
    }
    if (title) {
      help_page.title = title;
    }
    if (banner) {
      help_page.banner = banner;
    }
    if (sections) {
      help_page.sections = sections;
    }
    if (content) {
      help_page.content = content;
    }
    await this.help_pageEntityRepository.save(help_page);
    return help_page;
  }
}
