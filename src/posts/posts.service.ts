import { Injectable } from '@nestjs/common';

@Injectable()
export class PostsService {
  getHello(): string {
    return 'PostsService';
  }
}
