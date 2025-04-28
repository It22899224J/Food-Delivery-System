import { IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateDriverLocationDto {
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @IsNotEmpty() 
  @IsNumber()
  longitude: number;
}
