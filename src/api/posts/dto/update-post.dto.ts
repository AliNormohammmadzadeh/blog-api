import { IsString, IsOptional, IsUrl } from 'class-validator';

export class UpdatePostDto {
  @IsOptional() 
  @IsString()
  title?: string;

  @IsOptional() 
  @IsString()
  content?: string;

  @IsOptional() 
  @IsUrl()
  imageUrl?: string;
}
