import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthDto } from './dto/аuthDto.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: AuthDto) {
    return this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  signUp(@Body() signUpDto: AuthDto) {
    return this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: Request & { user: { id: number } }) {
    return req.user;
  }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }
}

// Этот метод будет вызываться клиентом для аутентификации пользователя. Он получит имя пользователя и пароль в теле запроса и вернет JWT-токен, если пользователь аутентифицирован.

//{"email": "john@gmail.com", "password": "123456"}
