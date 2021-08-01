import { useQuery } from "@apollo/client";
import React, { createContext, useEffect, useState } from "react";
import { PROFILE_QUERY } from "../../graphql";
import { IUserProfile } from "../../interfaces/userprofile.interface";

export const UserProfileContext = createContext({} as IUserProfile);

export const UserProfileContextProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<IUserProfile>({} as IUserProfile);

  useEffect(() => {
    console.log("UserProfileContextProvider useEffect");
    const initialState: IUserProfile = {
      id: "46b7d58b-2b87-45eb-8305-ee75de435106",
      name: "Marge",
      email: "4ewge@ye4f.su",
      is_admin: false,
      created_at: new Date(),
      updated_at: new Date(),
      avatar: {
        sm: "/photo_avatar.png",
        lg: "/photo_avatar.png",
      },
    };
    setData(initialState);
  }, []);

  // useEffect(() => {
  //   fetch("http://localhost:8088/usertest")
  //   .then(res => res.json())
  //   .then(data => {
  //     setData(data);
  //   })
  // }, []);

  // useEffect(() => {
  //   const { loading, error, data } = useQuery(PROFILE_QUERY);
  //   if (loading) return <p>Loading user profile from graphql...</p>;
  //   if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // }, []);

  return (
    <UserProfileContext.Provider value={data}>
      {children}
    </UserProfileContext.Provider>
  );
};
