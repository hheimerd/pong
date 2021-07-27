import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ChatMessageService } from './chat-message.service';
import { ChatMessage } from './entities/chat-message.entity';
import { CreateChatMessageInput } from './dto/create-chat-message.input';

@Resolver(() => ChatMessage)
export class ChatMessageResolver {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @Mutation(() => ChatMessage)
  createChatMessage(@Args('createChatMessageInput') createChatMessageInput: CreateChatMessageInput) {
    return this.chatMessageService.create(createChatMessageInput);
  }

  @Query(() => [ChatMessage], { name: 'chatMessage' })
  findAll() {
    return this.chatMessageService.findAll();
  }

  @Query(() => ChatMessage, { name: 'chatMessage' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.chatMessageService.findOne(id);
  }

  @Mutation(() => ChatMessage)
  removeChatMessage(@Args('id', { type: () => Int }) id: number) {
    return this.chatMessageService.remove(id);
  }
}
