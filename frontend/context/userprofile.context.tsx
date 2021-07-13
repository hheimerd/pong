import React, { createContext, useEffect, useState } from "react";
import {IUserProfile} from "../interfaces/userprofile.interface";

export const UserProfileContext = createContext({} as IUserProfile);

export const UserProfileContextProvider: React.FC = ({ children }: React.PropsWithChildren<{}>) => {
  const [data, setData] = useState<IUserProfile>({} as IUserProfile);

  useEffect(() => {
    console.log("Context useEffect 1");
    const initialState: IUserProfile = {
      id: '46b7d58b-2b87-45eb-8305-ee75de435106',
      name: 'Marge',
      email: '4ewge@ye4f.su',
      is_admin: false,
      created_at: '2021-07-12T07:20:02.781Z',
      updated_at: '2021-07-12T07:20:02.781Z',
      avatar: {
        sm: '/photo_avatar.png',
        lg: '/photo_avatar.png',
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

  return (
    <UserProfileContext.Provider value={data}>
      {children}
    </UserProfileContext.Provider>
  );
}
