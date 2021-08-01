import { gql } from "@apollo/client";

export const CREATE_MESSAGE_MUTATION = gql`
  mutation Mutation($createChatMessageInput: CreateChatMessageInput!) {
    createChatMessage(input: $createChatMessageInput)
  }
`;
