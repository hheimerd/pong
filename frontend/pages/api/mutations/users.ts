import { gql } from "@apollo/client";

export const CREATE_USER = gql`
mutation($createUserInput: CreateUserDto!)  {
  createUser(input: $createUserInput) {
    id
    name
    email
    login
    roles
  }
}
`;