import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BadRequestException } from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name, telephone, address, rolName } = registerDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El correo electrónico ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const roleName = rolName || 'USER';
    const role = await this.prisma.role.findUnique({
      where: { roleName },
    });

    if (!role) {
      throw new ConflictException(`El rol ${roleName} no existe`);
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        telephone,
        password: hashedPassword,
        address: address || null,
        rolId: role.id,
        verified: false,
      },
    });

    const token = this.generateToken(user.id, user.email, role.roleName);

    return {
      message: 'Usuario registrado exitosamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: role.roleName,
      },
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = this.generateToken(user.id, user.email, user.role.roleName);

    return {
      message: 'Inicio de sesión exitoso',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role.roleName,
      },
      token,
    };
  }

  private generateToken(userId: number, email: string, role: string): string {
    const payload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
  const { currentPassword, newPassword } = changePasswordDto;

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new UnauthorizedException('Usuario no encontrado');
  }

  const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedException('Contraseña actual incorrecta');
  }

  if (currentPassword === newPassword) {
    throw new BadRequestException('La nueva contraseña debe ser diferente a la actual');
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await this.prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  return {
    message: 'Contraseña actualizada exitosamente',
  };
}
}