import { useMutation, useQuery } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, Htag } from "../../../components";
import {
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
  USERS_QUERY,
  USER_QUERY,
} from "../../../graphql";
import styles from "./edit.module.css";

const UserAddEdit = (): JSX.Element => {
  const router = useRouter();
  const { id } = router.query;
  const isCreatePage = id === "create" || typeof id === "undefined";

  // get user
  const {
    data: data,
    error: error,
    loading: loading,
  } = useQuery(USER_QUERY, {
    skip: isCreatePage,
    variables: { userId: +id },
  });

  // create user
  const [
    createUser,
    {
      data: dataCreateUser,
      loading: loadingCreateUser,
      error: errorCreateUser,
    },
  ] = useMutation(CREATE_USER_MUTATION, {
    refetchQueries: [
      {
        query: USERS_QUERY,
        variables: {
          usersOffset: 0,
          usersLimit: 100,
        },
      },
    ],
    onError(err) {
      console.log(err);
    },
  });

  // update user
  const [
    updateUser,
    {
      data: dataUpdateUser,
      loading: loadingUpdateUser,
      error: errorUpdateUser,
    },
  ] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [
      {
        query: USERS_QUERY,
        variables: {
          usersOffset: 0,
          usersLimit: 100,
        },
      },
    ],
    onError(err) {
      console.log(err);
    },
  });

  // form fields states
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [email, setEmail] = React.useState("");

  // form fields refs
  const nameRef = useRef<HTMLInputElement | null>();
  const passwordRef = useRef<HTMLInputElement | null>();
  const emailRef = useRef<HTMLInputElement | null>();
  const loginRef = useRef<HTMLInputElement | null>();

  // form fields validation states
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isLoginValid, setIsLoginValid] = useState(true);

  // on loading USER_QUERY
  useEffect(() => {
    // console.log("loading: ", loading);
    if (!loading && !isCreatePage) {
      // console.log("data: ", data);
      setName(data.user.name);
      if (nameRef.current) nameRef.current.value = data.user.name;
      setPassword(data.user.password);
      if (passwordRef.current) passwordRef.current.value = data.user.password;
      setEmail(data.user.email);
      if (emailRef.current) emailRef.current.value = data.user.email;
      setLogin(data.user.login);
      if (loginRef.current) loginRef.current.value = data.user.login;
    }
  }, [loading]);

  // on submit
  useEffect(() => {
    if (
      typeof dataCreateUser !== "undefined" ||
      typeof dataUpdateUser !== "undefined"
    ) {
      // console.log("mutation data: ", dataCreateUser);
      router.push("/admin");
    }
  }, [loadingCreateUser, loadingUpdateUser]);

  // on submit
  useEffect(() => {
    console.log("mutation error: ", errorCreateUser);
  }, [errorCreateUser]);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const emailIsValid = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const isFormValid = (): boolean => {
    if (name !== "") {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
      nameRef.current.focus();
      return false;
    }
    if (login.length >= 6) {
      setIsLoginValid(true);
    } else {
      setIsLoginValid(false);
      loginRef.current.focus();
      return false;
    }
    if (typeof password === "undefined" || password.length >= 6) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
      passwordRef.current.focus();
      return false;
    }
    if (emailIsValid(email)) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
      emailRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormValid()) {
      if (id === "create") {
        // send message to backend via mutation CREATE_USER_MUTATION
        createUser({
          variables: {
            createUserInput: {
              name: name,
              email: email,
              login: login,
              password: password,
            },
          },
        });
      } else {
        // send message to backend via mutation UPDATE_USER_MUTATION
        updateUser({
          variables: {
            updateUserInput: {
              id: +id,
              name: name,
              email: email,
              login: login,
              // ...(typeof password !== "undefined" && { newPassword: password }),
            },
          },
        });
      }
      // console.log(name + ", " + login + ", " + password + ", " + email);
    }
  };

  // check router variable type
  if (typeof id !== "string") return null;

  return (
    <div className={styles.form}>
      <Htag tag="h1">{isCreatePage ? "Add user" : "Edit user"}</Htag>
      {errorCreateUser && <p className="error-message"> Error occured </p>}
      <form onSubmit={handleSubmit}>
        <div className={styles.line}>
          <TextField
            id="name"
            label="Name *"
            fullWidth
            size="small"
            variant="outlined"
            onChange={(event) => setName(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={name}
            inputRef={nameRef}
            error={!isNameValid}
            helperText={!isNameValid ? "Empty field!" : " "}
          />
        </div>
        {isCreatePage && (
          <div className={styles.line}>
            <TextField
              id="password"
              label="Password"
              fullWidth
              size="small"
              type="password"
              variant="outlined"
              defaultValue={password}
              InputLabelProps={{ shrink: true }}
              onChange={(event) => setPassword(event.target.value)}
              inputRef={passwordRef}
              error={!isPasswordValid}
              helperText={
                !isPasswordValid
                  ? "Must be longer than or equal to 6 characters!"
                  : " "
              }
            />
          </div>
        )}
        <div className={styles.line}>
          <TextField
            id="login"
            label="Login"
            fullWidth
            size="small"
            variant="outlined"
            onChange={(event) => setLogin(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={login}
            inputRef={loginRef}
            error={!isLoginValid}
            helperText={
              !isLoginValid
                ? "Must be longer than or equal to 6 characters!"
                : " "
            }
          />
        </div>
        <div className={styles.line}>
          <TextField
            id="email"
            label="Email"
            fullWidth
            size="small"
            variant="outlined"
            onChange={(event) => setEmail(event.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={email}
            inputRef={emailRef}
            error={!isEmailValid}
            helperText={!isEmailValid ? "Not valid email!" : " "}
          />
        </div>
        <div className={styles.line}>
          <Button appearance="primary">Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default UserAddEdit;
