import { Test, TestingModule } from '@nestjs/testing';
import {
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
    };
    role: {
      findUnique: jest.Mock;
    };
  };

  const mockUser = {
    id: 1,
    name: 'Juan Perez',
    email: 'juan@test.com',
    telephone: '123456789',
    password: 'hashed_password',
    address: 'Calle 123',
    verified: false,
    rolId: 2,
    registerAt: new Date(),
  };

  const mockRole = {
    id: 2,
    roleName: 'USER',
  };

  const mockRegisterDto: RegisterDto = {
    name: 'Juan Perez',
    email: 'juan@test.com',
    telephone: '123456789',
    password: 'MiPassword123!',
    address: 'Calle 123',
  };

  const mockLoginDto: LoginDto = {
    email: 'juan@test.com',
    password: 'MiPassword123!',
  };

  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock.token';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            role: {
              findUnique: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue(mockToken),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should throw ConflictException if email already exists', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should hash the password before saving', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      await service.register(mockRegisterDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('MiPassword123!', 10);
    });

    it('should assign USER role by default', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);

      await service.register(mockRegisterDto);

      expect(prismaService.role.findUnique).toHaveBeenCalledWith({
        where: { roleName: 'USER' },
      });
    });

    it('should return user data and token on success', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);
      jest.spyOn(prismaService.role, 'findUnique').mockResolvedValue(mockRole);
      jest.spyOn(prismaService.user, 'create').mockResolvedValue(mockUser);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');

      const result = await service.register(mockRegisterDto);

      expect(result).toEqual({
        message: 'Usuario registrado exitosamente',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockRole.roleName,
        },
        token: mockToken,
      });
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user does not exist', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return user data and token on successful login', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        ...mockUser,
        role: mockRole,
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(mockLoginDto);

      expect(result).toEqual({
        message: 'Inicio de sesión exitoso',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockRole.roleName,
        },
        token: mockToken,
      });
    });
  });
  describe('changePassword', () => {
    const mockChangePasswordDto = {
      currentPassword: 'MiPassword123!',
      newPassword: 'NewPassword456!',
    };

    it('should throw BadRequestException if new password equals current password', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.changePassword(1, {
          currentPassword: 'MiPassword123!',
          newPassword: 'MiPassword123!',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash the new password and update it', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      const updateSpy = jest
        .spyOn(prismaService.user, 'update')
        .mockResolvedValue(mockUser);

      await service.changePassword(1, mockChangePasswordDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('NewPassword456!', 10);
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { password: 'new_hashed_password' },
      });
    });

    it('should return success message on successful password change', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      jest.spyOn(prismaService.user, 'update').mockResolvedValue(mockUser);

      const result = await service.changePassword(1, mockChangePasswordDto);

      expect(result).toEqual({
        message: 'Contraseña actualizada exitosamente',
      });
    });
  });
});
