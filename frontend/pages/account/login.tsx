import { useLazyQuery } from "@apollo/client";
import { TextField } from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Htag } from "../../components";
import { PersonalTokenContext } from "../../context/personaltoken/personaltoken.context";
import { USER_LOGIN } from "../../graphql";

const Profile = (): JSX.Element => {
  const { token, setToken } = useContext(PersonalTokenContext);
  const router = useRouter();

  const [login, { loading, data, error }] = useLazyQuery(USER_LOGIN);

  // form fields states
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  // form fields refs
  const nameRef = useRef<HTMLInputElement | null>();
  const passwordRef = useRef<HTMLInputElement | null>();

  // form fields validation states
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // on finish submit
  useEffect(() => {
    if (typeof data !== "undefined") {
      console.log("data loading: ", data);
      localStorage.setItem("token", data.login.access_token);
      setToken(data.login.access_token);
      if (localStorage.getItem("token") !== "") {
        console.log("token: ", localStorage.getItem("token"));
        router.push("/profile");
      }
    }
  }, [loading]);

  // on submit error
  useEffect(() => {
    console.log("error: ", error);
  }, [error]);

  // wait fetching data
  if (loading) return <p>Loading user profile from graphql...</p>;
  // if (error) return <p>Error: can't fetching data from graphql :(</p>;

  const isFormValid = (): boolean => {
    if (name !== "") {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
      nameRef.current.focus();
      return false;
    }
    if (typeof password === "undefined" || password.length >= 6) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
      passwordRef.current.focus();
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormValid()) {
      login({
        variables: {
          loginLogin: name,
          loginPassword: password,
        },
      });
    }
  };

  return (
    <div className="form">
      <Htag tag="h1">Login</Htag>
      {error && <p className="error-message"> Error: {error.message} </p>}
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
  );
};

export default Profile;
