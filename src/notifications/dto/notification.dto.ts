import { IsNotEmpty, IsString } from 'class-validator';

export default class NotificationDto {
  @IsNotEmpty()
  @IsString()
  public triggeredBy: string;

  @IsNotEmpty()
  @IsString()
  public triggeredOn: string;

  @IsNotEmpty()
  @IsString()
  public notificationMessage: string;

  @IsNotEmpty()
  @IsString()
  public postId: string;
}
