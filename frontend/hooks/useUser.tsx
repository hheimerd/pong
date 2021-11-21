import { useQuery } from "@apollo/client";
import { PROFILE_QUERY } from "../graphql/queries";
import { IUserProfile } from "../interfaces/userprofile.interface";

export default function useUser(): IUserProfile {
  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY, {
    onError(err) {
      console.log("useUser", err);
    },
  });

  // wait fetching data
  if (loading) return;
  if (error) return;

  return data.getProfile;
}
