import { gql } from "@apollo/client";

export const PROFILE_QUERY = gql`
  query {
    getProfile {
      id
      name
      email
      login
      roles
      TwoFactorAuth
      avatar
      status
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
        punishments {
          chatId
          fromUserId
          toUserId
          degree
          created_at
          minutes
        }
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
          status
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
        punishments {
          chatId
          fromUserId
          toUserId
          degree
          created_at
          minutes
        }
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
      punishments {
        chatId
        fromUserId
        toUserId
        degree
        created_at
        minutes
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
      type
      is_private
      hasPassword
      punishments {
        chatId
        fromUserId
        toUserId
        degree
        created_at
        minutes
      }
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
      status
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
      status
    }
  }
`;

export const USER_LOGIN = gql`
  query Query($loginPassword: String!, $loginLogin: String!) {
    login(password: $loginPassword, login: $loginLogin) {
      access_token
      message
    }
  }
`;

export const VERIFY_TWOFA = gql`
  query Query($verify2FaAuthId: String!, $verify2FaCode: String!) {
    verify2fa(auth_id: $verify2FaAuthId, code: $verify2FaCode) {
      access_token
      message
    }
  }
`;
