import { useQuery } from '@apollo/client';
import { PROFILE_QUERY } from '../graphql/queries';


export default function useUser() {
  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY);

  // wait fetching data
  if (!data) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  return data.getProfile;
}
