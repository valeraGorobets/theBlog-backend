import { Body, Controller, Post } from '@nestjs/common';
import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { AuthService } from './auth.service';

export class AuthDto {
  @IsEmail()
  @IsNotEmpty()
  @Matches(/^.+@\S+\.\S+$/, {
    message: 'Invalid email format',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Z])(?=.*[<>{}()\[\]!@#$%^&*]).{6,}$/, {
    message: 'Password must contain at least 1 uppercase letter, 1 special character from the set <>{}()[]!@#$%^&*, and be at least 6 symbols long.',
  })
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
  ) {}

  @Post()
  loginUser(@Body() _body: AuthDto): string {
    return this.authService.generateFakeAccessToken();
  }
}
