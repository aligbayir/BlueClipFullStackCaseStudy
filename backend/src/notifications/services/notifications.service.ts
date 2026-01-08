import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { Notification } from '../entities/notification.entity';
import { FirebaseService } from '../../firebase/services/firebase.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  private notifications: Notification[] = [];
  // Token storage simulation (In real app, store in DB)
  private userTokens: Map<string, string> = new Map();

  constructor(private firebaseService: FirebaseService) { }

  // Helper to store token (call this from a register-token endpoint)
  saveToken(userId: string, token: string) {
    this.userTokens.set(userId, token);
  }

  async create(userId: string, createNotificationDto: CreateNotificationDto) {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      title: createNotificationDto.title,
      body: createNotificationDto.body,
      timestamp: new Date(),
      status: 'pending',
    };

    this.notifications.push(notification);

    // Trigger Push
    await this.sendPush(notification);

    return notification;
  }

  findAll(userId: string) {
    return this.notifications.filter((n) => n.userId === userId);
  }

  async sendPush(notification: Notification) {
    const token = this.userTokens.get(notification.userId);
    if (!token) {
      console.log(`No token found for user ${notification.userId}`);
      notification.status = 'failed';
      return;
    }

    try {
      await this.firebaseService.getMessaging().send({
        token,
        notification: {
          title: notification.title,
          body: notification.body,
        },
        data: {
          id: notification.id,
        }
      });
      notification.status = 'sent';
      console.log(`Notification sent to ${notification.userId}`);
    } catch (error) {
      console.error('Error sending push:', error);
      notification.status = 'failed';
    }
  }

  // Standalone send
  async send(userId: string, title: string, body: string) {
    const notification: Notification = {
      id: uuidv4(),
      userId,
      title,
      body,
      timestamp: new Date(),
      status: 'pending',
    };
    this.notifications.push(notification);
    await this.sendPush(notification);
    return notification;
  }
}
