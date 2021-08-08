import { gql } from "@apollo/client";

export const MESSAGES_SUBSCRIPTION = gql`
  subscription Subscription($token: String!, $chatId: String!) {
    messageAdded(token: $token, chatId: $chatId) {
      message
      userId
      created_at
    }
  }
`;
