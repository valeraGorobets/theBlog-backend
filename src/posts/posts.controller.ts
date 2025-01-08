import { Controller, Get, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
	) {
	}

	@Get()
	async getHello(): Promise<object> {
		return await this.postsService.getAll();
	}

	@Post()
	async pushNew(): Promise<void> {
		return await this.postsService.pushNew();
	}
}
