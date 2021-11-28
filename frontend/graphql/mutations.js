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
      name
      ownerId
    }
  }
`;
export const UPDATE_CHAT_MUTATION = gql`
  mutation Mutation($updateChatInput: UpdateChatInput!) {
    updateChat(input: $updateChatInput) {
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
export const FOLLOW_TO_USER = gql`
  mutation Mutation($followToUserUserId: Int!) {
    followToUser(userId: $followToUserUserId)
  }
`;
export const UNFOLLOW_TO_USER = gql`
  mutation UnfollowUserMutation($unfollowUserUserId: Int!) {
    unfollowUser(userId: $unfollowUserUserId)
  }
`;
export const PUNISHMENT_USER_MUTATION = gql`
  mutation Mutation(
    $addUserPunishmentInChatDegree: PunishmentDegree!
    $addUserPunishmentInChatTargetUserId: Int!
    $addUserPunishmentInChatChatId: String!
    $addUserPunishmentInChatMinutes: Int
  ) {
    addUserPunishmentInChat(
      degree: $addUserPunishmentInChatDegree
      targetUserId: $addUserPunishmentInChatTargetUserId
      chatId: $addUserPunishmentInChatChatId
      minutes: $addUserPunishmentInChatMinutes
    )
  }
`;
export const UNPUNISHMENT_USER_MUTATION = gql`
  mutation Mutation(
    $removeUserPunishmentInChatDegree: PunishmentDegree!
    $removeUserPunishmentInChatTargetUserId: Int!
    $removeUserPunishmentInChatChatId: String!
  ) {
    removeUserPunishmentInChat(
      degree: $removeUserPunishmentInChatDegree
      targetUserId: $removeUserPunishmentInChatTargetUserId
      chatId: $removeUserPunishmentInChatChatId
    )
  }
`;
export const ADD_MEMBER_TO_CHAT_MUTATION = gql`
  mutation Mutation($chatId: String!, $password: String, $userId: Int) {
    addMemberToChat(chatId: $chatId, password: $password, userId: $userId)
  }
`;
export const RM_MEMBER_CHAT_MUTATION = gql`
  mutation Mutation($chatId: String!, $userId: Int) {
    removeMemberFromChat(chatId: $chatId, userId: $userId)
  }
`;
export const DELETE_CHAT_MUTATION = gql`
  mutation Mutation($removeChatId: String!) {
    removeChat(id: $removeChatId)
  }
`;
