import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  //Req,
  //UseGuards,
} from '@nestjs/common';
//import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/аuthDto.dto';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(@Body() signInDto: AuthDto) {
    return await this.authService.signIn(signInDto.email, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async signUp(@Body() signUpDto: AuthDto) {
    return await this.authService.signUp(signUpDto.email, signUpDto.password);
  }

  // @UseGuards(AuthGuard)
  // @Get('profile')
  // async getProfile(@Req() req: Request & { user: { id: number } }) {
  //   return await this.authService.getProfile(req.user.id);
  // }

  @Public()
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return await this.authService.verifyEmail(token);
  }

  @Public()
  @Post('request-password-reset')
  async requestPasswordReset(@Body('email') email: string) {
    return await this.authService.requestPasswordReset(email);
  }

  @Public()
  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return await this.authService.resetPassword(token, password);
  }
}

// Этот метод будет вызываться клиентом для аутентификации пользователя. Он получит имя пользователя и пароль в теле запроса и вернет JWT-токен, если пользователь аутентифицирован.

//{"email": "john@gmail.com", "password": "123456"}
