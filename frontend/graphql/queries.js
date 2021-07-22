import { gql } from '@apollo/client';

export const PROFILE_QUERY = gql`
  query {
    getProfile {
      name
      email
      login
      roles
      id
    }
  }
`;
