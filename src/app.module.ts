import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { RoomService } from './room/room.service';
import { UserService } from './user/user.service';
import { RoomGateway } from './room/room.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatGateway, ChatService, RoomService, UserService, RoomGateway],
})
export class AppModule {}
