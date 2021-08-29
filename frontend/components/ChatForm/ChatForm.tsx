import { useMutation, useQuery } from "@apollo/client";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React, { useEffect, useRef } from "react";
// import { UserProfileContext } from "../../context/userprofile/userprofile.context";
import { CREATE_MESSAGE_MUTATION, PROFILE_QUERY } from "../../graphql";
import { Avatar } from "../Avatar/Avatar";
import styles from "./ChatForm.module.css";
import { ChatFormListProps } from "./ChatForm.props";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const ChatForm = ({ id }: ChatFormListProps): JSX.Element => {
  // const { name } = useContext(UserProfileContext);
  // console.log("name: ", name);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setOpen(true);
  }, []);

  const { loading, error, data } = useQuery(PROFILE_QUERY);
  const [addMessage, { data: dataM, loading: loadingM, error: errorM }] =
    useMutation(CREATE_MESSAGE_MUTATION, {
      onError(err) {
        console.log(err);
      },
    });
  const inputElement = useRef(null);

  // wait for fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  if (errorM) {
    return (
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error">
          {errorM.message || "Error occured"}
        </Alert>
      </Snackbar>
    );
  }

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
