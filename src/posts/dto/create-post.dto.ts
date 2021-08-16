import {
  IsString,
  IsNumber,
  Min,
  Max,
  MaxLength,
  IsArray,
  IsNotEmpty,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  caption: string;

  @IsString({ each : true })
  @IsArray()
  @IsNotEmpty()
  images: Array<string>;
}
