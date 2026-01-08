import { IsNotEmpty, IsString } from 'class-validator';

export class SendNotificationDto {
    @IsNotEmpty()
    @IsString()
    userId: string;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    body: string;
}
