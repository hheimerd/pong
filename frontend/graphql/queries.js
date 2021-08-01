import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query {
    getProfile {
      id
      name
      avatar
    }
  }
`;

export const CHATS_QUERY = gql`
  query {
    getProfile {
      id
      chats {
        id
        members {
          name
          id
          avatar
        }
        type
      }
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query Query($chatId: String!) {
    chat(id: $chatId) {
      messages {
        created_at
        message
        user {
          name
          id
          avatar
        }
      }
    }
  }
`;
