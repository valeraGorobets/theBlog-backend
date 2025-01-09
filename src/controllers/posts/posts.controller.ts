import {
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Post,
	Query, UseGuards,
	UsePipes,
	ValidationPipe
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { AuthGuard } from '../../guards/auth.guard';

export class GetAllPostsQuery {
	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	page?: number;

	@IsOptional()
	@Type(() => Number)
	@IsNumber()
	@Min(0)
	limit?: number;

	constructor(page: number = 1, limit: number = 10) {
		this.page = page;
		this.limit = limit;
	}
}

export class CreatePostDto {
	@IsNotEmpty()
	@IsString()
	@MaxLength(30, { message: 'Title must not exceed 30 characters.' })
	title: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(500, { message: 'Text must not exceed 500 characters.' })
	content: string;
}

@Controller('posts')
export class PostsController {
	constructor(
		private readonly postsService: PostsService,
	) {
	}

	@Get()
	@UsePipes(new ValidationPipe({ transform: true }))
	async getAll(@Query() { page, limit }: GetAllPostsQuery): Promise<object[]> {
		return await this.postsService.getRemainingPosts(page, limit);
	}

	@Get('recent')
	async getRecent(): Promise<object[]> {
		return await this.postsService.getRecentPosts();
	}

	@Get('amount')
	async getAmount(): Promise<number> {
		return await this.postsService.getRemainingPostsAmount();
	}

	@Get(':id')
	async findOne(@Param('id') id: string): Promise<object> {
		const post = await this.postsService.getPostById(id);
		if (!post) {
			throw new NotFoundException(`Item with ID ${id} not found.`);
		}

		return post;
	}

	@UseGuards(AuthGuard)
	@Post()
	async create(@Body() createPostDto: CreatePostDto): Promise<object> {
		return this.postsService.createNewPostObject(createPostDto);
	}

	@UseGuards(AuthGuard)
	@Delete(':id')
	async remove(@Param('id') id: string): Promise<void> {
		const post = await this.postsService.deletePostById(id);
		if (!post) {
			throw new NotFoundException(`Item with ID ${id} not found.`);
		}
	}
}
