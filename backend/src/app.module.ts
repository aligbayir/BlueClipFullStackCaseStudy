import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FirebaseModule,
    AuthModule,
    NotificationsModule,
  ],
})
export class AppModule { }
