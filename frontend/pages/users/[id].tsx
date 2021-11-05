import { useMutation, useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { Avatar, Button, Htag } from "../../components";
import { MatchHistory } from "../../components/MatchHistory/MatchHistory";
import {
  CREATE_CHAT_MUTATION,
  FOLLOW_TO_USER,
  PROFILE_QUERY,
  UNFOLLOW_TO_USER,
  USER_QUERY,
  GAME_RESULT,
} from "../../graphql";
import { ChatType, IChat } from "../../interfaces/chat.interface";
import { IGameResult } from "../../interfaces/gameresult.interface";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../layout/InnerPageLayout";
import styles from "./users.module.css";

const UserProfile = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;

  // get my profile
  const {
    data: dataProfile,
    error: errorProfile,
    loading: loadingProfile,
  } = useQuery(PROFILE_QUERY);

  // get viewed user
  const {
    data: dataVProfile,
    error: errorVProfile,
    loading: loadingVProfile,
  } = useQuery(USER_QUERY, {
    variables: {
      skip: !id,
      fetchPolicy: "cache-and-network",
      userId: +id,
    },
  });

  // get viewed user game stats
  const {
    data: dataGames,
    error: errorGames,
    loading: loadingGames,
  } = useQuery(GAME_RESULT, {
    variables: {
      skip: 0,
      fetchPolicy: "cache-and-network",
      userId: +id,
      take: 100,
    },
  });

  // follow to user
  const [followUser, { loading: loadingF }] = useMutation(FOLLOW_TO_USER, {
    refetchQueries: [{ query: PROFILE_QUERY }],
  });

  // follow to user
  const [unfollowUser, { loading: loadingU, error: errorU }] = useMutation(
    UNFOLLOW_TO_USER,
    {
      refetchQueries: [{ query: PROFILE_QUERY }],
      onError(err) {
        console.log(err);
      },
    }
  );

  // create chat mutation
  const [createChat, { data: dataCreateChat, loading: loadingCreateChat }] =
    useMutation(CREATE_CHAT_MUTATION, {
      refetchQueries: [{ query: PROFILE_QUERY }],
      onError(err) {
        console.log(err);
      },
    });

  // on submit message button
  useEffect(() => {
    if (dataCreateChat) {
      router.push("/chats/room/" + dataCreateChat.createChat.id);
    }
  }, [loadingCreateChat]);

  // wait fetching data
  if (loadingVProfile || loadingProfile || loadingF || loadingU || loadingGames)
    return <p>Loading user profile from graphql...</p>;
  if (errorVProfile || errorProfile || errorU || errorGames)
    return <p>Error: can't fetching data from graphql :(</p>;

  const isUserFriend = () => {
    return (
      dataProfile.getProfile.friends.filter(
        (x: IUserProfile) => x.id === dataVProfile.user.id
      ).length != 0
    );
  };

  const isUserInFollowers = () => {
    return (
      dataProfile.getProfile.followers.filter(
        (x: IUserProfile) => x.id === dataVProfile.user.id
      ).length != 0
    );
  };

  const isUserInFollowings = () => {
    return (
      dataProfile.getProfile.following.filter(
        (x: IUserProfile) => x.id === dataVProfile.user.id
      ).length != 0
    );
  };

  const handleFriends = () => {
    console.log("isUserInFollowings", isUserInFollowings());
    if (isUserFriend())
      return unfollowUser({
        variables: {
          unfollowUserUserId: dataVProfile.user.id,
        },
      });
    if (isUserInFollowers())
      return followUser({
        variables: {
          followToUserUserId: dataVProfile.user.id,
        },
      });
    if (isUserInFollowings())
      return unfollowUser({
        variables: {
          unfollowUserUserId: dataVProfile.user.id,
        },
      });
    followUser({
      variables: {
        followToUserUserId: dataVProfile.user.id,
      },
    });
  };

  // const handleBlock = () => {
  //   console.log("handleBlock");
  // };

  const createChatWithUser = () => {
    const membersIdArr = [dataProfile.getProfile.id, +id];
    createChat({
      variables: {
        createChatCreateChatInput: {
          name: dataVProfile.user.name,
          members: membersIdArr,
          type: ChatType.Chat,
          is_private: false,
        },
      },
    });
  };

  const get_chats_with_user = () => {
    return dataProfile.getProfile.chats.filter(
      (x: IChat) =>
        x.type === ChatType.Chat &&
        x.members.filter((y: IUserProfile) => y.id === dataVProfile.user.id)
          .length != 0
    );
  };

  const handleMessage = () => {
    // filter chats only with ChatType == Chat
    console.log("handleMessage", get_chats_with_user());
    if (get_chats_with_user().length != 0) {
      router.push("/chats/room/" + get_chats_with_user()[0].id);
    } else {
      createChatWithUser();
    }
  };

  const getFriendButton = () => {
    // console.log("isUserInFollowings: ", isUserInFollowings());
    if (isUserFriend())
      return (
        <Button appearance="ghost" onClick={() => handleFriends()}>
          Remove from friend
        </Button>
      );
    if (isUserInFollowers())
      return (
        <Button appearance="ghost" onClick={() => handleFriends()}>
          Add to friend
        </Button>
      );
    if (isUserInFollowings())
      return (
        <Button appearance="primary" onClick={() => handleFriends()}>
          Unfollow
        </Button>
      );
    return (
      <Button appearance="ghost" onClick={() => handleFriends()}>
        Add to friend
      </Button>
    );
  };

  const isThisPageForMyProfile = dataProfile.getProfile.id == +id;

  console.log("dataGames", typeof dataGames.gameResult);

  // iterate over all games
  const arr = Array.from(dataGames.gameResult);
  console.log("arr", arr);
  const HistoryList = Array.from(dataGames.gameResult).map(
    (oneresult: IGameResult, i: number) => {
      return (
        <React.Fragment key={i}>
          <MatchHistory
            scores={[+oneresult.score[0], +oneresult.score[1]]}
            users={[+oneresult.players[0], +oneresult.players[1]]}
          />
        </React.Fragment>
      );
    }
  );

  return (
    <InnerPageLayout>
      <div>
        <Htag tag="h1">{dataVProfile.user.name}</Htag>
        <div className={styles.container}>
          <div>
            <Avatar
              size="large"
              name={dataVProfile.user.name}
              image={dataVProfile.user.avatar}
            />
          </div>
          <div>
            Status: {dataVProfile.user.status}
            <br />
            Rank: {dataVProfile.user.rank}
            <br />
            {/*
            Wins: ?<br />
            Loses: ?<br />
            */}
          </div>
          {!isThisPageForMyProfile && (
            <div>
              {getFriendButton()}
              <br />
              <br />
              <Button appearance="ghost" onClick={() => handleMessage()}>
                Message
              </Button>
            </div>
          )}
        </div>
        <div className={styles.history_container}>{HistoryList}</div>
      </div>
    </InnerPageLayout>
  );
};

export default UserProfile;
