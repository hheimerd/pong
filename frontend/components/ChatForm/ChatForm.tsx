import { gql, useMutation, useQuery } from "@apollo/client";
import React, { useRef } from "react";
import { CREATE_MESSAGE_MUTATION, PROFILE_QUERY } from "../../graphql";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatForm.module.css";

export const ChatForm = (): JSX.Element => {
  // const {loading, error, data} = useContext(UserProfileContext);
  const { loading, error, data } = useQuery(PROFILE_QUERY);
  // const { dispatch } = useContext(ChatContext);
  const [addMessage] = useMutation(CREATE_MESSAGE_MUTATION);
  const inputElement = useRef(null);

  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (inputElement.current.value === "") return;

      // const msg: IChatMessage = {
      //   message: inputElement.current.value,
      //   created_at: new Date(),
      //   user: {
      //     id: data.getProfile.id,
      //   },
      // };
      // dispatch({
      //   type: ActionType.SendMessage,
      //   payload: msg,
      // });

      addMessage({
        variables: {
          createChatMessageInput: {
            chat_id: "4b6dbbf6-09a4-4120-9d71-37f6fdd2cc98",
            message: inputElement.current.value,
          },
        },
      });

      inputElement.current.value = "";
    }
  };

  console.log("data: " + data.getProfile.avatar);
  // if (!data.getProfile) return null;

  return (
    <section className={styles.box}>
      <Avatar image={data.getProfile.avatar} alt={data.getProfile.name} />
      <input
        onKeyPress={handleKeyDown}
        className={styles.input}
        maxLength={250}
        placeholder="Сообщение..."
        autoComplete="off"
        ref={inputElement}
        id="messageContent"
      />
    </section>
  );
};
