import {
  IsString,
  MaxLength,
  IsArray,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  caption: string;

  @IsNumber()
  longitude ?: number;

  @IsNumber()
  latitude ?: number;
}
