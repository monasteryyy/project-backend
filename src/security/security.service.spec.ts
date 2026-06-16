import { Test, TestingModule } from '@nestjs/testing';
import { SecurityService } from './security.service';

describe('SecurityService', () => {
  let service: SecurityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SecurityService],
    }).compile();

    service = module.get<SecurityService>(SecurityService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate passwords with multiple input cases', () => {
    const cases = [
      {
        name: 'valid password',
        password: 'Segura123!',
        expected: true,
      },
      {
        name: 'exactly 8 valid characters',
        password: 'Abc123!@',
        expected: true,
      },
      {
        name: 'less than 8 characters',
        password: 'Seg1!',
        expected: false,
      },
      {
        name: 'without numbers',
        password: 'Contrasena!',
        expected: false,
      },
      {
        name: 'without symbols',
        password: 'Contrasena123',
        expected: false,
      },
      {
        name: 'without letters',
        password: '12345678!',
        expected: false,
      },
      {
        name: 'empty password',
        password: '',
        expected: false,
      },
    ];

    for (const testCase of cases) {
      const result = service.validatePassword(testCase.password);

      expect(result).toBe(testCase.expected);
    }
  });

  it('should validate account verification rules', () => {
    const cases = [
      {
        name: 'email verified',
        user: {
          emailVerified: true,
          phoneVerified: false,
          accountBlocked: false,
        },
        expected: true,
      },
      {
        name: 'phone verified',
        user: {
          emailVerified: false,
          phoneVerified: true,
          accountBlocked: false,
        },
        expected: true,
      },
      {
        name: 'both verified',
        user: {
          emailVerified: true,
          phoneVerified: true,
        },
        expected: true,
      },
      {
        name: 'none verified',
        user: {
          emailVerified: false,
          phoneVerified: false,
        },
        expected: false,
      },
      {
        name: 'account blocked',
        user: {
          emailVerified: true,
          phoneVerified: true,
          accountBlocked: true,
        },
        expected: false,
      },
    ];

    for (const testCase of cases) {
      const result = service.verifyAccount(testCase.user);

      expect(result).toBe(testCase.expected);
    }
  });

  it('should protect sensitive contact information', () => {
    const contactInfo = {
      contactNumber: '3001234567',
      email: 'usuario@test.com',
    };

    const cases = [
      {
        name: 'accepted task',
        status: 'ACCEPTED',
        expected: contactInfo,
      },
      {
        name: 'accepted task lowercase',
        status: 'accepted',
        expected: contactInfo,
      },
      {
        name: 'published task',
        status: 'PUBLISHED',
        expected: {
          contactNumber: 'Información restringida',
          email: 'Información restringida',
        },
      },
      {
        name: 'cancelled task',
        status: 'CANCELLED',
        expected: {
          contactNumber: 'Información restringida',
          email: 'Información restringida',
        },
      },
      {
        name: 'unknown status',
        status: 'UNKNOWN',
        expected: {
          contactNumber: 'Información restringida',
          email: 'Información restringida',
        },
      },
    ];

    for (const testCase of cases) {
      const result = service.filterSensitiveContactInfo(
        testCase.status,
        contactInfo,
      );

      expect(result).toEqual(testCase.expected);
    }
  });
});
