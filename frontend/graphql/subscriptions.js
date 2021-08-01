import { gql } from "@apollo/client";

export const MESSAGES_SUBSCRIPTION = gql`
  subscription Subscription($token: String!, $chatId: String!) {
    messageAdded(token: $token, chatId: $chatId) {
      message
      user {
        name
        avatar
      }
      created_at
    }
  }
`;
