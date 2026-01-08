import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { RegisterTokenDto } from '../dto/register-token.dto';
import { AuthGuard } from '../../auth/auth.guard';
import { GetUser } from '../../auth/get-user.decorator';
import { DecodedUser } from '../../auth/user.interface';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }

  @UseGuards(AuthGuard)
  @Post()
  create(@GetUser() user: DecodedUser, @Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(user.uid, createNotificationDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll(@GetUser() user: DecodedUser) {
    return this.notificationsService.findAll(user.uid);
  }

  @Post('send')
  async send(@Body() sendNotificationDto: SendNotificationDto) {
    return this.notificationsService.send(
      sendNotificationDto.userId,
      sendNotificationDto.title,
      sendNotificationDto.body,
    );
  }

  @UseGuards(AuthGuard)
  @Post('register-token')
  registerToken(@GetUser() user: DecodedUser, @Body() registerTokenDto: RegisterTokenDto) {
    this.notificationsService.saveToken(user.uid, registerTokenDto.token);
    return { success: true };
  }
}
