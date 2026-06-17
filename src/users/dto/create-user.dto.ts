import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  telephone!: string;

  @IsString()
  password!: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsBoolean()
  verified?: boolean;

  @IsInt()
  @Min(1)
  rolId!: number;
}
