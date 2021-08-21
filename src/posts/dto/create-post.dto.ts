import {
  IsString,
  MaxLength,
  IsArray,
  IsNotEmpty,
  IsLatLong,
  IsNumber,
} from 'class-validator';

export class CreatePostDto {
  @IsString()
  @MaxLength(100)
  caption: string;

  @IsString({ each : true })
  @IsArray()
  @IsNotEmpty()
  images: Array<string>;

  @IsNumber()
  longitude ?: number;

  @IsNumber()
  latitude ?: number;
}
