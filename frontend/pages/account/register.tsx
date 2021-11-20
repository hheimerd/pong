import { useLazyQuery, useMutation } from "@apollo/client";
import TextField from "@material-ui/core/TextField";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Htag } from "../../components";
import { PersonalTokenContext } from "../../context/personaltoken/personaltoken.context";
import { useSnackBar } from "../../context/snackbar/snackbar.context";
import { USER_LOGIN } from "../../graphql";
import { CREATE_USER_MUTATION } from "../../graphql/mutations";
import { extractGraphQLError } from "../../helpers/error-handling.utils";
import { HomePageLayout } from "../../layout/HomePageLayout";

const Register = (): JSX.Element => {
  const { setToken } = useContext(PersonalTokenContext);
  const { updateSnackBarMessage } = useSnackBar();
  const [infoMessage, setInfoMessage] = useState("");

  const [createUser, { data, loading, error }] = useMutation(
    CREATE_USER_MUTATION,
    {
      onError(err) {
        updateSnackBarMessage(extractGraphQLError(err).message);
      },
    }
  );

  const [loginLazy, { loading: loadingL, data: dataL, error: errorL }] =
    useLazyQuery(USER_LOGIN);

  const router = useRouter();

  // form fields states
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [login, setLogin] = React.useState("");

  // form fields refs
  const nameRef = useRef<HTMLInputElement | null>();
  const passwordRef = useRef<HTMLInputElement | null>();
  const emailRef = useRef<HTMLInputElement | null>();
  const loginRef = useRef<HTMLInputElement | null>();

  // form fields validation states
  const [isNameValid, setIsNameValid] = useState(true);
  const [isLoginValid, setIsLoginValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // on loading USER_QUERY
  useEffect(() => {
    // console.log("loading: ", loading);
    if (!loading && data) {
      // console.log("data: ", data);
    }
  }, [loading]);

  // on finish submit
  useEffect(() => {
    if (typeof data !== "undefined") {
      // console.log("data: ", data);
      console.log("CREATE_USER_MUTATION");
      console.log("login", login);
      console.log("password", password);
      loginLazy({
        variables: {
          loginLogin: login,
          loginPassword: password,
        },
      });
      // router.push("/account/login");
    }
  }, [loading]);

  // on finish submit
  useEffect(() => {
    if (typeof dataL !== "undefined") {
      console.log("data loading: ", dataL);
      if (dataL.login.access_token) {
        setToken(dataL.login.access_token);
        router.push("/profile");
      } else {
        console.log("message", dataL.login.message);
        setInfoMessage(data.login.message);
      }
    }
  }, [loadingL]);

  // on submit error
  useEffect(() => {
    if (typeof error !== "undefined") {
      console.log("error: ", error);
    }
  }, [error]);

  // wait fetching data
  if (loading || loadingL) return <p>Loading user profile from graphql...</p>;
  if (errorL) return <p>Error: can't fetching data from graphql :(</p>;

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
    if (login !== "") {
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
      // send message to backend via mutation UPDATE_USER_MUTATION
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
    }
  };

  return (
    <HomePageLayout>
      <span className="backlink" onClick={() => router.back()}>
        &lt; Back
      </span>
      <Htag tag="h2">Registration</Htag>
      {error && (
        <p className="error-message">
          Error: {extractGraphQLError(error).message}
        </p>
      )}
      {infoMessage && <p className="info-message"> {infoMessage} </p>}
      <div className="loginform">
        <form onSubmit={handleSubmit}>
          <div className="line">
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
          <div className="line">
            <TextField
              id="login"
              label="Login *"
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
              helperText={!isLoginValid ? "Empty field!" : " "}
            />
          </div>
          <div className="line">
            <TextField
              id="email"
              label="Email *"
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
              helperText={!isEmailValid ? "Empty field!" : " "}
            />
          </div>
          <div className="line">
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
          <div className="line">
            <Button appearance="primary">Submit</Button>
          </div>
        </form>
      </div>
    </HomePageLayout>
  );
};

export default Register;
