import { IsBoolean } from 'class-validator';;

export class UpdateDriverAvailabilityDto {
  @IsBoolean()
  isAvailable: boolean;
}
