import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useEffect, useRef } from "react";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import { MESSAGES_SUBSCRIPTION } from "../../graphql";
import { MESSAGES_QUERY, USERS_QUERY } from "../../graphql/queries";
import { IChatMessage } from "../../interfaces/message.interface";
import { IChatPunishment } from "../../interfaces/punishments.interface";
import { IUserProfile } from "../../interfaces/userprofile.interface";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import styles from "./ChatMessageList.module.css";
import { ChatMessageListProps } from "./ChatMessageList.props";
export const ChatMessageList = ({
  id,
  current_user_id,
}: ChatMessageListProps): JSX.Element => {
  const router = useRouter();
  const {
    loading: loadingUsers,
    error: errorUsers,
    data: dataUsers,
  } = useQuery(USERS_QUERY, {
    variables: {
      usersOffset: 0,
      usersLimit: 100,
    },
  });
  const { loading, error, data, subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: { chatId: id },
  });
  const { updateSnackBarMessage } = useSnackBar();

  // Make ref for scrolling to down of message list
  // const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    try {
      subscribeToMore({
        document: MESSAGES_SUBSCRIPTION,
        variables: {
          token: localStorage.getItem("token"),
          chatId: id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          console.log("subscriptionData", subscriptionData.data);
          const newMessage = subscriptionData.data.messageAdded;
          console.log("newMessage", newMessage);

          return { ...prev, chat: [newMessage, ...prev.chat.messages] };
        },
      });
    } catch (e) {
      console.log(e);
    }
  }, [subscribeToMore]);

  // const {state, dispatch} = useContext(ChatContext);

  // useEffect(() => {
  //   console.log("ChatMessageList useEffect, state: " + state);
  //   dispatch({
  //     type: ActionType.GetMessages,
  //     payload: id
  //   });
  // }, []);

  // const scrollToBottom = () => {
  //   console.log("ref in useEffect");
  //   messagesEndRef?.current?.scrollIntoView({
  //     block: "end",
  //     inline: "nearest",
  //     behavior: "smooth",
  //   });
  // };

  const AlwaysScrollToBottom = () => {
    const elementRef = useRef<HTMLDivElement>();
    useEffect(() =>
      elementRef.current.scrollIntoView({
        block: "end",
        inline: "nearest",
        behavior: "smooth",
      })
    );
    return <div ref={elementRef} />;
  };

  // useEffect(() => {
  //   scrollToBottom();
  // });

  // wait until state will be ready
  // if(!state) return null;
  if (loading || loadingUsers)
    return <p>Loading user profile from graphql...</p>;
  if (error) {
    // router.push("/channels");
    return <p> Error MESSAGES_QUERY: {error.message} </p>;
  }
  if (errorUsers) {
    // router.push("/channels");
    return <p> Error USERS_QUERY: {errorUsers.message} </p>;
  }

  // console.log(data.chat.messages);

  // iterate over all messages
  const Messages = Array.from(data.chat.messages)
    .slice(0)
    .reverse()
    .map((onemessage: IChatMessage, i: number) => {
      const user = dataUsers.users.find(
        (x: IUserProfile) => x.id === onemessage.userId
      );

      const isBlocked = data.chat.punishments
        .filter((x: IChatPunishment) => x.degree == "SELF_MUTE")
        .filter((x: IChatPunishment) => x.fromUserId == current_user_id)
        .filter(
          (x: IChatPunishment) => x.toUserId === onemessage.userId
        ).length;

      if (!isBlocked) {
        return (
          <React.Fragment key={i}>
            <ChatMessage onemessage={onemessage} user={user} />
          </React.Fragment>
        );
      }
    });
  return (
    <div className={styles.wrapper}>
      {Messages}
      <AlwaysScrollToBottom />
    </div>
  );
};
