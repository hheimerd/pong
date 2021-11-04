import { useQuery } from "@apollo/client";
import { USER_QUERY } from "../graphql/queries";

export default function useUser(id: number) {
  // get user
  const { data, error, loading } = useQuery(USER_QUERY, {
    variables: { id: id },
  });

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  return data.user;
}
