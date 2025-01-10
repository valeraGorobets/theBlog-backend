import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './controllers/user/user.module';
import { PostsModule } from './controllers/posts/posts.module';
import { AuthModule } from './controllers/auth/auth.module';
import { RandomErrorMiddleware } from './middlewares/random-error-middleware.middleware';
import { WebSocketsModule } from './ws/websockets.module';

@Module({
	imports: [UserModule, PostsModule, AuthModule, WebSocketsModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(RandomErrorMiddleware)
			.forRoutes('*');
	}
}
