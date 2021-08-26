import { useMutation, useQuery } from "@apollo/client";
import { TextField } from "@material-ui/core";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, Button, Htag, OutlinedDiv } from "../../components";
import { PROFILE_QUERY, UPDATE_USER_MUTATION } from "../../graphql";
import { InnerPageLayout } from "../../layout/InnerPageLayout";

const Profile = (): JSX.Element => {
  const router = useRouter();

  // get user
  const { data, error, loading } = useQuery(PROFILE_QUERY);

  // update user
  const [
    updateUser,
    {
      data: dataUpdateUser,
      loading: loadingUpdateUser,
      error: errorUpdateUser,
    },
  ] = useMutation(UPDATE_USER_MUTATION, {
    refetchQueries: [{ query: PROFILE_QUERY }],
    onError(err) {
      console.log(err);
    },
  });

  // form fields states
  const [name, setName] = React.useState("");
  // const [password, setPassword] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [avatar, setAvatar] = React.useState(["", ""]);

  // form fields refs
  const nameRef = useRef<HTMLInputElement | null>();
  // const passwordRef = useRef<HTMLInputElement | null>();
  const emailRef = useRef<HTMLInputElement | null>();
  const avatarRef = useRef<HTMLInputElement | null>();

  // form fields validation states
  const [isNameValid, setIsNameValid] = useState(true);
  // const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);

  // on loading USER_QUERY
  useEffect(() => {
    // console.log("loading: ", loading);
    if (!loading && data) {
      console.log("data: ", data);
      setName(data.getProfile.name);
      if (nameRef.current) nameRef.current.value = data.getProfile.name;
      // setPassword(data.user.password);
      // if (passwordRef.current) passwordRef.current.value = data.user.password;
      setEmail(data.getProfile.email);
      if (emailRef.current) emailRef.current.value = data.getProfile.email;
      setAvatar(data.getProfile.avatar);
      // if (avatarRef.current) avatarRef.current.value = data.getProfile.avatar;
    }
  }, [loading]);

  // on finish submit
  useEffect(() => {
    if (typeof dataUpdateUser !== "undefined") {
      // console.log("mutation data: ", dataCreateUser);
      router.push("/profile");
    }
  }, [loadingUpdateUser]);

  // on submit error
  useEffect(() => {
    console.log("mutation error: ", errorUpdateUser);
  }, [errorUpdateUser]);

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
    // if (typeof password === "undefined" || password.length >= 6) {
    //   setIsPasswordValid(true);
    // } else {
    //   setIsPasswordValid(false);
    //   passwordRef.current.focus();
    //   return false;
    // }
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
      updateUser({
        variables: {
          updateUserInput: {
            id: data.getProfile.id,
            name: name,
            email: email,
            // avatar: avatar,
            // ...(typeof password !== "undefined" && { newPassword: password }),
          },
        },
      });
      if (avatarRef.current.value) {
        console.log("avatar: " + avatarRef.current.value);
        const formData = new FormData();
        formData.append("image", avatarRef.current.files[0]);
        axios
          .post("http://localhost:3000/user/avatar", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          })
          .then((resp) => {
            console.log("resp.data: ", resp.data);
            console.log("resp.status: ", resp.status);
          })
          .catch((err) =>
            console.error("Error avatar upload!", err.config, err.response.data)
          );
      }
    }
  };

  return (
    <InnerPageLayout>
      <div className="form">
        <Htag tag="h1">Edit my profile</Htag>
        {errorUpdateUser && <p className="error-message"> Error occured </p>}
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
          {/* 
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

        */}
          <div className="line">
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
          <div className="line">
            <OutlinedDiv label="Avatar">
              <Avatar
                size="large"
                name={data.getProfile.name}
                image={data.getProfile.avatar}
              />
              <input id="avatar" type="file" ref={avatarRef} />
              {/*
          <label htmlFor="avatar">
          <Button color="primary" variant="contained" component="span">
            Upload File
          </Button>
          </label>
          */}
            </OutlinedDiv>
          </div>
          <div className="line">
            <Button appearance="primary">Submit</Button>
          </div>
        </form>
      </div>
    </InnerPageLayout>
  );
};

export default Profile;
