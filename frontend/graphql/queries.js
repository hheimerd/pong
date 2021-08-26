import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query {
    getProfile {
      id
      name
      email
      login
      avatar
      friends {
        id
        name
        avatar
      }
      followers {
        id
        name
        avatar
      }
      following {
        id
        name
        avatar
      }
      chats {
        id
        name
        members {
          name
          id
          avatar
        }
        ownerId
        admins {
          name
          id
          avatar
        }
        type
        is_private
        hasPassword
      }
    }
  }
`;

export const MY_CHATS_QUERY = gql`
  query {
    getProfile {
      id
      chats {
        id
        name
        members {
          name
          id
          avatar
        }
        ownerId
        admins {
          name
          id
          avatar
        }
        type
        is_private
        hasPassword
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
        userId
      }
    }
  }
`;

export const CHATS_QUERY = gql`
  query Query {
    chats {
      id
      name
      members {
        name
        id
        avatar
      }
      ownerId
      admins {
        name
        id
        avatar
      }
      banned {
        name
        id
        avatar
      }
      type
      is_private
      hasPassword
    }
  }
`;

export const USERS_QUERY = gql`
  query Query($usersOffset: Int!, $usersLimit: Int!) {
    users(offset: $usersOffset, limit: $usersLimit) {
      id
      name
      email
      login
      created_at
      updated_at
      avatar
      roles
    }
  }
`;

export const USER_QUERY = gql`
  query Query($userId: Int!) {
    user(id: $userId) {
      id
      name
      email
      login
      created_at
      updated_at
      avatar
      roles
    }
  }
`;

export const USER_LOGIN = gql`
  query Query($loginPassword: String!, $loginLogin: String!) {
    login(password: $loginPassword, login: $loginLogin) {
      access_token
    }
  }
`;
