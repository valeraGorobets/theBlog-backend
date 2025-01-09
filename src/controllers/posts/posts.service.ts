import { Injectable } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';

@Injectable()
export class PostsService {
	private db: JsonDB;

	constructor() {
		this.db = new JsonDB(new Config('./src/db/posts', true, false, '/'));
	}

	public async getAll(): Promise<object> {
		return await this.db.getData('/');
	}

	public async pushNew(): Promise<void> {
		return await this.db.push('/test1', new Date());
	}
}
