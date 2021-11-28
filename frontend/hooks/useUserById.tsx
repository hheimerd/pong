import { useQuery } from "@apollo/client";
import { USER_QUERY } from "../graphql/queries";
import { IUserProfile } from "../interfaces/userprofile.interface";

export default function useUserById(id: number): IUserProfile {
  // get user
  const { data, error, loading } = useQuery(USER_QUERY, {
    variables: { userId: id },
    onError(err) {
      console.log("useUserById", err);
    },
  });

  // wait fetching data
  if (loading) return;
  if (error) return;

  return data.user;
}
