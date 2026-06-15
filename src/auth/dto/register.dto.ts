import { IsString, IsEmail, MinLength, Matches, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  telephone!: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message: 'Password must have at least 1 letter, 1 number, and 1 symbol'
  })
  password!: string;

  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  rolName?: string;
}