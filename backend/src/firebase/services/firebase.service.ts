import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private app: admin.app.App;

  constructor(private configService: ConfigService) { }

  onModuleInit() {
    if (!admin.apps.length) {
      const projectId = this.configService.get<string>('FIREBASE_PROJECT_ID');
      const clientEmail = this.configService.get<string>('FIREBASE_CLIENT_EMAIL');
      const privateKey = this.configService.get<string>('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n');

      if (!projectId || !clientEmail || !privateKey) {
        console.warn('Firebase credentials not provided in .env. Falling back to Application Default Credentials.');
        this.app = admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      } else {
        this.app = admin.initializeApp({
          credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
          }),
        });
      }
      console.log('Firebase Admin Initialized');
    } else {
      this.app = admin.app();
    }
  }

  getAuth() {
    return this.app.auth();
  }

  getMessaging() {
    return this.app.messaging();
  }
}
