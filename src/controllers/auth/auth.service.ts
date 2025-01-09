import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
	public generateFakeAccessToken(): string {
		const timestamp = new Date().getTime().toString();
		const randomValue = Math.random().toString(36).substring(2, 15);
		const rawToken = `token_${ timestamp }_${ randomValue }`;
		return Buffer.from(rawToken).toString('base64');
	}
}
