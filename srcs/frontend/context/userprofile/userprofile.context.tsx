import React, { createContext, useEffect, useState } from "react";
import { IUserProfile } from "../../interfaces/userprofile.interface";

export const UserProfileContext = createContext({} as IUserProfile);

export const UserProfileContextProvider: React.FC = ({ children }) => {
  const [profile, setProfile] = useState<IUserProfile>({} as IUserProfile);
  // const { data, loading } = useQuery(PROFILE_QUERY);

  // useEffect(() => {
  //   if (!loading) {
  //     console.log("UserProfileContextProvider useEffect onLoading");
  //     setProfile(data);
  //   }
  // }, [loading]);

  return (
    <UserProfileContext.Provider value={profile}>
      {children}
    </UserProfileContext.Provider>
  );
};
