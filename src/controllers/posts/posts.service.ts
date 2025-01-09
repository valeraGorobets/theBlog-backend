import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';
import { CreatePostDto } from './posts.controller';
import { faker } from '@faker-js/faker';

const recentVisibleAmount: number = 3;
const tags = ['design', 'technology', 'innovation', 'education', 'health', 'science', 'culture', 'travel', 'food', 'sports'];

@Injectable()
export class PostsService {
	private db: JsonDB;

	constructor() {
		this.db = new JsonDB(new Config('./src/db/posts', true, false, '/'));
	}

	public async getRemainingPosts(page: number, limit: number): Promise<object[]> {
		const startIndex = (page - 1) * limit;
		const endIndex = page * limit;
		return (await this.getAll())
			.slice(recentVisibleAmount)
			.slice(startIndex, endIndex);
	}

	public async getRemainingPostsAmount(): Promise<number> {
		return await this.getPostsAmount() - recentVisibleAmount;
	}

	public async getRecentPosts(): Promise<object[]> {
		return (await this.getAll()).slice(0, recentVisibleAmount);
	}

	public async getPostById(id: string): Promise<object> {
		const index = await this.db.getIndex('/posts', id);
		if (index === -1) {
			return null;
		}
		return this.db.getData(`/posts[${ index }]`);
	}

	public async createNewPostObject({ title, content }: CreatePostDto): Promise<object> {
		const newPost = {
			id: await this.getNextId(),
			tittttttle: title,
			content: content,
			tags: this.getRandomTags(),
			the_real_date_of_creation: new Date().toISOString(),
			author_name: faker.person.fullName(),
			img: 'https://picsum.photos/600/300',
		};

		await this.db.push('/posts[]', newPost, true);

		return newPost;
	}

	public async deletePostById(id: string): Promise<boolean> {
		const index = await this.db.getIndex('/posts', id);
		if (index === -1) {
			return null;
		}
		await this.db.delete(`/posts[${ index }]`);
		return true;
	}

	private async getPostsAmount(): Promise<number> {
		const posts = await this.getAll();
		return posts
			.map((p: any) => p.id)
			.sort((a, b) => b - a)[0];
	}

	private async getAll(): Promise<object[]> {
		const allPosts = (await this.db.getData('/') as { posts: any[] }).posts;
		return allPosts.sort((a, b) => {
			return new Date(b.the_real_date_of_creation).getTime() - new Date(a.the_real_date_of_creation).getTime();
		});
	}

	private async getNextId(): Promise<string> {
		const latest = await this.getPostsAmount();
		return (+latest + 1).toString();
	}

	private getRandomTags(): string[] {
		for (let i = tags.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[tags[i], tags[j]] = [tags[j], tags[i]];
		}
		const numberOfTags = Math.floor(Math.random() * 3) + 1;
		return tags.slice(0, numberOfTags);
	}
}
