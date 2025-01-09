import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards/auth.guard';
import { faker } from '@faker-js/faker';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  @Get('/info')
  getUserInfo(): object {
    return {
      userId: faker.string.uuid(),
      username: faker.person.fullName(),
      avatar: faker.image.avatar(),
      registeredAt: faker.date.past(),
    };
  }
}
