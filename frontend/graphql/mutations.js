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

export const CREATE_USER_MUTATION = gql`
  mutation Mutation($createUserInput: CreateUserDto!) {
    createUser(input: $createUserInput) {
      id
    }
  }
`;

export const DELETE_USER_MUTATION = gql`
  mutation Mutation($removeUserId: Float!) {
    removeUser(id: $removeUserId)
  }
`;

export const UPDATE_USER_MUTATION = gql`
  mutation Mutation($updateUserInput: UpdateUserDto!) {
    updateUser(input: $updateUserInput) {
      id
    }
  }
`;
