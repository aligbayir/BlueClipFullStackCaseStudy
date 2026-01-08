import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from '../services/notifications.service';
import { AuthGuard } from '../../auth/auth.guard';

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

const mockNotificationsService = {
    create: jest.fn().mockImplementation((uid, dto) => ({ id: '1', userId: uid, ...dto })),
    findAll: jest.fn().mockReturnValue([]),
    send: jest.fn().mockResolvedValue({ status: 'sent' }),
    saveToken: jest.fn(),
};

const mockAuthGuard = {
    canActivate: jest.fn().mockReturnValue(true),
};

describe('NotificationsController', () => {
    let controller: NotificationsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [NotificationsController],
            providers: [
                {
                    provide: NotificationsService,
                    useValue: mockNotificationsService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue(mockAuthGuard)
            .compile();

        controller = module.get<NotificationsController>(NotificationsController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
