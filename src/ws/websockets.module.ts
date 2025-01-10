import { Module, OnModuleInit } from '@nestjs/common';
import { WebSocketsService } from './websockets.service';

@Module({
	providers: [WebSocketsService],
})
export class WebSocketsModule implements OnModuleInit {
	constructor(private readonly webSocketsService: WebSocketsService) {}

	onModuleInit() {
		this.webSocketsService.startWebSocketServer();
	}
}