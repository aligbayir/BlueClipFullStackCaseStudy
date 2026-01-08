import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

// Mock ConfigService
const mockConfigService = {
    get: jest.fn().mockReturnValue('mock-value'),
};

// Mock firebase-admin
jest.mock('firebase-admin', () => {
    return {
        apps: [],
        initializeApp: jest.fn().mockReturnValue({
            auth: jest.fn(),
            messaging: jest.fn(),
        }),
        credential: {
            cert: jest.fn(),
            applicationDefault: jest.fn(),
        },
        app: jest.fn().mockReturnValue({
            auth: jest.fn(),
            messaging: jest.fn(),
        }),
    };
});

describe('FirebaseService', () => {
    let service: FirebaseService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                FirebaseService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<FirebaseService>(FirebaseService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('onModuleInit', () => {
        it('should initialize firebase admin app', () => {
            service.onModuleInit();
            expect(admin.initializeApp).toHaveBeenCalled();
        });
    });
});
