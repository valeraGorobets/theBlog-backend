import { Injectable, Logger } from '@nestjs/common';
import * as WebSocket from 'ws';

@Injectable()
export class WebSocketsService {
	private readonly logger = new Logger(WebSocketsService.name);
	private wss: WebSocket.Server;
	private readonly port: number = 8000;

	private getRandomNumber(start: number, end: number): number {
		return Math.floor(Math.random() * (end - start + 1) + start);
	}

	startWebSocketServer(): void {
		this.wss = new WebSocket.Server({ port: this.port, path: '/ws' });
		this.logger.log(`WebSocket server started on port ${this.port}`);

		this.wss.on('connection', (ws: WebSocket) => {
			let subscription;

			ws.on('message', (message: string) => {
				message = message.toString();
				this.logger.log(`Received: ${ message }`);

				if (message === 'subscribe') {
					if (subscription) {
						this.logger.log('Already subscribed, ignoring...');
						return;
					}

					ws.send(JSON.stringify({
						value: this.getRandomNumber(100000, 200000),
						type: 'snapshot',
					}));


					this.logger.log('Subscribing client to random numbers...');
					subscription = setInterval(() => {
						ws.send(JSON.stringify({
							value: this.getRandomNumber(10000, 20000),
							type: 'delta',
						}));
					}, 5000);
				} else if (message === 'unsubscribe') {
					if (subscription) {
						clearInterval(subscription);
						subscription = null;
						this.logger.log('Unsubscribed client from random numbers.');
					}
				}
			});
		});
	}
}