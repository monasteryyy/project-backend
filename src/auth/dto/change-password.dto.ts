import { IsString, Length, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @Length(8, 50)
  currentPassword!: string;

  @IsString()
  @Length(8, 50)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/, {
    message: 'La contraseña debe tener al menos una letra, un número y un símbolo',
  })
  newPassword!: string;
}