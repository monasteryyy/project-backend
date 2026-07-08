import { IsOptional, IsString, IsEmail, IsPhoneNumber, Length } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(10, 20)
  telephone?: string;

  @IsOptional()
  @IsString()
  @Length(0, 160)
  address?: string;
}