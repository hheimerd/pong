import { gql } from "@apollo/client";

export const CREATE_MESSAGE_MUTATION = gql`
  mutation Mutation($createChatMessageInput: CreateChatMessageInput!) {
    createChatMessage(input: $createChatMessageInput)
  }
`;

export const CREATE_CHAT_MUTATION = gql`
  mutation Mutation($createChatCreateChatInput: CreateChatInput!) {
    createChat(createChatInput: $createChatCreateChatInput) {
      id
    }
  }
`;

export const UPDATE_CHAT_MUTATION = gql`
  mutation Mutation($updateChatInput: UpdateChatInput!) {
    updateChatInput(input: $updateChatInput) {
      id
    }
  }
`;
