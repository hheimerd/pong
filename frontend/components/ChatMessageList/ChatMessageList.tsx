import { useQuery } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import { MESSAGES_SUBSCRIPTION } from "../../graphql";
import { MESSAGES_QUERY } from "../../graphql/queries";
import { IChatMessage } from "../../interfaces/message.interface";
import { ChatMessage } from "../ChatMessage/ChatMessage";
import styles from "./ChatMessageList.module.css";
import { ChatMessageListProps } from "./ChatMessageList.props";

export const ChatMessageList = ({ id }: ChatMessageListProps): JSX.Element => {
  const { loading, error, data, subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: { chatId: id },
  });

  // Make ref for scrolling to down of message list
  // const messagesEndRef = useRef<null | HTMLDivElement>(null);

  useEffect(() => {
    try {
      subscribeToMore({
        document: MESSAGES_SUBSCRIPTION,
        variables: {
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ikl2YW4gUGV0cm92IiwiZW1haWwiOiJpdmFuMkB0ZXN0LnJ1IiwibG9naW4iOiJpdmFuX3AiLCJyb2xlcyI6WyJ1c2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTMxVDE4OjE3OjA3LjkyNloiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0zMVQxODoxNzowNy45MjZaIiwiYXZhdGFyIjpbXSwiaWF0IjoxNjI3ODQwNjM4LCJleHAiOjE2Mjg0NDU0Mzh9.n6w1qlgvlTajPspmT25iWUTBRFs8c4WvGZTP4y5b_X4",
          chatId: id,
        },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          // console.log(subscriptionData.data);
          const newMessage = subscriptionData.data.messageAdded.message;

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
    const elementRef = useRef();
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
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  // console.log(data.chat.messages);

  // iterate over all messages
  const Messages = Array.from(data.chat.messages).map(
    (onemessage: IChatMessage, i: number) => {
      return (
        <React.Fragment key={i}>
          <ChatMessage onemessage={onemessage} />
        </React.Fragment>
      );
    }
  );
  return (
    <div className={styles.wrapper}>
      {Messages}
      <AlwaysScrollToBottom />
    </div>
  );
};
