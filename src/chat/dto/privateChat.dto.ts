import { PublicChatDTO } from './publicChat.dto';

export class PrivateChatDto extends PublicChatDTO {
  to_id: string;
}
