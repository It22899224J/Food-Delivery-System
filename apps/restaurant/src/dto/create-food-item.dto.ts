import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsBoolean,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFoodItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  price: number;

  // Removed image: Buffer — now handled via @UploadedFile()

  @IsString()
  @IsNotEmpty()
  categoryId: string;

  @IsBoolean()
  @Type(() => Boolean)
  available: boolean;

  @IsBoolean()
  @Type(() => Boolean)
  popular: boolean;

  @IsString()
  @IsOptional()
  image?: string; // Base64 image string
  
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dietary?: string[];

  @IsString()
  @IsNotEmpty()
  restaurantId: string;
}
