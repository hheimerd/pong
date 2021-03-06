import { useQuery } from "@apollo/client";
import { useRouter } from "next/router";
import { join } from "path/posix";
import React, { useEffect, useRef } from "react";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import { MESSAGES_SUBSCRIPTION } from "../../graphql";
import { MESSAGES_QUERY, USERS_QUERY } from "../../graphql/queries";
import { extractGraphQLError } from "../../helpers/error-handling.utils";
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
    onError(err) {
      console.log(err);
      updateSnackBarMessage(extractGraphQLError(err).message);
    },
  });
  const { loading, error, data, subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: { chatId: id,
    },
    onError(err) {
      console.log(err);
      updateSnackBarMessage(extractGraphQLError(err).message);
    },
  });
  const { updateSnackBarMessage } = useSnackBar();

  useEffect(() => {
    try {
      subscribeToMore({
        document: MESSAGES_SUBSCRIPTION,
        variables: {
          fetchPolicy: "network-only",
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
        onError(err) {
          console.log(err);
          updateSnackBarMessage(extractGraphQLError(err).message);
        },
      });
    } catch (e) {
      console.log(e);
    }
  }, [subscribeToMore]);

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
  console.log("data from chatmessage", data);
  if (loading || loadingUsers)
    return <p>Loading user profile from graphql...</p>;
  if (error) {
    router.push("/channels");
    // return <p> Error: {extractGraphQLError(error).message} </p>;
  }
  if (errorUsers) {
    router.push("/channels");
    // return <p> Error: {extractGraphQLError(errorUsers).message} </p>;
  }
  if (!data) {
    window.location.href = "/channels";
  }
  else {
    console.log("tabdddou");
    
  }

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
          <React.Fragment key={""+onemessage.created_at}>
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
