import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GetHelpPagesFilterDto {
  @IsOptional()
  @IsString()
  search?: string;
}

export class CreateHelpPageDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  banner: string;

  @IsNotEmpty()
  @IsString()
  sections: string;

  @IsNotEmpty()
  @IsString()
  content: string;
}

export class UpdateHelpPageDto {
  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  banner: string;

  @IsOptional()
  @IsString()
  sections: string;

  @IsOptional()
  @IsString()
  content: string;
}
