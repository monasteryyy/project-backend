import { Injectable } from '@nestjs/common';

@Injectable()
export class SecurityService {
  validatePassword(password: string): boolean {
    if (!password || password.length < 8) return false;
    const hasLetter = /[A-Za-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return hasLetter && hasNumber && hasSymbol;
  }

  verifyAccount(user: {
    emailVerified: boolean;
    phoneVerified: boolean;
    accountBlocked: boolean;
  }): boolean {
    if (user.accountBlocked) {
      return false;
    }
    return user.emailVerified || user.phoneVerified;
  }

  filterSensitiveContactInfo(
    taskStatus: string,
    contactInfo: { contactNumber: string; email: string },
  ): { contactNumber: string; email: string } {
    if (taskStatus.toUpperCase() === 'ACCEPTED') {
      return contactInfo;
    }
    return {
      contactNumber: 'Información restringida',
      email: 'Información restringida',
    };
  }
}
