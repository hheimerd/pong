import { useMutation, useQuery } from "@apollo/client";
import React, { useRef } from "react";
// import { UserProfileContext } from "../../context/userprofile/userprofile.context";
import { CREATE_MESSAGE_MUTATION, PROFILE_QUERY } from "../../graphql";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatForm.module.css";
import { ChatFormListProps } from "./ChatForm.props";

export const ChatForm = ({ id }: ChatFormListProps): JSX.Element => {
  // const { name } = useContext(UserProfileContext);
  // console.log("name: ", name);
  const { loading, error, data } = useQuery(PROFILE_QUERY);
  const [addMessage] = useMutation(CREATE_MESSAGE_MUTATION);
  const inputElement = useRef(null);

  // wait for fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      if (inputElement.current.value === "") return;

      // send message to back via mutation CREATE_MESSAGE_MUTATION
      addMessage({
        variables: {
          createChatMessageInput: {
            chatId: id,
            message: inputElement.current.value,
          },
        },
      });

      // clear input element
      inputElement.current.value = "";
    }
  };

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
