import { gql } from "@apollo/client";

export const GET_USERS = gql `
query Query($usersOffset: Int!, $usersLimit: Int!) {
  users(offset: $usersOffset, limit: $usersLimit) {
    id
    name
    login
    roles
    email
  }
}
`;