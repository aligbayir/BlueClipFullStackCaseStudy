import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { FirebaseService } from '../../firebase/services/firebase.service';
import { Notification } from '../entities/notification.entity';

jest.mock('uuid', () => ({
    v4: jest.fn().mockReturnValue('mock-uuid-v4'),
}));

// Mock firebase-admin completely
jest.mock('firebase-admin', () => ({
    apps: [],
    initializeApp: jest.fn(),
    credential: {
        cert: jest.fn(),
        applicationDefault: jest.fn(),
    },
    messaging: jest.fn(),
    auth: jest.fn(),
}));

const mockFirebaseService = {
    getMessaging: jest.fn().mockReturnValue({
        send: jest.fn().mockResolvedValue('mock-message-id'),
    }),
};

describe('NotificationsService', () => {
    let service: NotificationsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationsService,
                {
                    provide: FirebaseService,
                    useValue: mockFirebaseService,
                },
            ],
        }).compile();

        service = module.get<NotificationsService>(NotificationsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a notification', async () => {
            const userId = 'user-123';
            const dto = { title: 'Test', body: 'Body' };
            service.saveToken(userId, 'token');

            const result = await service.create(userId, dto);
            expect(result.userId).toBe(userId);
            expect(result.status).toBe('sent');
        });
    });
});
