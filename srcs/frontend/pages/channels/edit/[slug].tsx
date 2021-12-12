import { useMutation, useQuery } from "@apollo/client";
import { Avatar, Chip, FormControlLabel, Switch } from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, Htag } from "../../../components";
import {
  CREATE_CHAT_MUTATION,
  MY_CHATS_QUERY,
  UPDATE_CHAT_MUTATION,
  USERS_QUERY,
} from "../../../graphql";
import useChannelById from "../../../hooks/useChannelById";
import { ChatType, IChat } from "../../../interfaces/chat.interface";
import { IUserProfile } from "../../../interfaces/userprofile.interface";
import { InnerPageLayout } from "../../../layout/InnerPageLayout";

const ChannelRoom = (): JSX.Element => {
  const {
    data: dataR,
    error: errorR,
    loading: loadingR,
  } = useQuery(USERS_QUERY, {
    variables: { usersOffset: 0, usersLimit: 100 },
    onError(err) {
      console.log("channel room USERS_QUERY", err);
    },
  });

  // const { loading, error, data } = useQuery(MY_CHATS_QUERY);

  const [createChat, { data: dataM, loading: loadingM }] = useMutation(
    CREATE_CHAT_MUTATION,
    {
      refetchQueries: [{ query: MY_CHATS_QUERY }],
      onError(err) {
        console.log("CREATE_CHAT_MUTATION error");
        console.log(err);
      },
    }
  );

  const [updateChat, { data: dataU, loading: loadingU, error: errorU }] =
    useMutation(UPDATE_CHAT_MUTATION, {
      refetchQueries: [{ query: MY_CHATS_QUERY }],
      onError(err) {
        console.log("UPDATE_CHAT_MUTATION error");
        console.log(err);
      },
    });
  const router = useRouter();
  const { slug } = router.query;

  // states for form fields
  const [usersValue, setUsersValue] = React.useState<Array<IUserProfile>>();
  const [adminsValue, setAdminsValue] = React.useState<Array<IUserProfile>>();
  const [isPrivate, setPrivate] = React.useState(false);
  const privateRef = useRef<HTMLInputElement>();
  const [name, setName] = React.useState("");
  const nameRef = useRef<HTMLInputElement>();
  const [password, setPassword] = React.useState("");
  const passwordRef = useRef<HTMLInputElement>();

  // Hack to redraw Autocomplete
  // https://stackoverflow.com/questions/59790956/material-ui-autocomplete-clear-value
  const [usersInputReset, setUsersInputReset] = React.useState("");
  const [adminsInputReset, setAdminsInputReset] = React.useState("");

  const [isUsersValid, setIsUsersValid] = useState(true);
  const [isAdminsValid, setIsAdminsValid] = useState(true);
  const [isNameValid, setIsNameValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);

  // get current channel from current user profile
  // const getChannel = () => {
  //   const channel = data.getProfile.chats.filter(
  //     (x: IChat) => x.id === slug
  //   )[0];
  //   return channel;
  // };
  const channel = useChannelById(slug);

  // on loading CHATS_QUERY
  useEffect(() => {
    if (typeof channel !== "undefined" && slug !== "create") {
      setName(channel.name);
      // update name input field default value
      if (nameRef.current) nameRef.current.value = channel.name;
      setUsersValue(channel.members);
      setAdminsValue(channel.admins);
      setPrivate(channel.is_private);
      if (privateRef.current) privateRef.current.value = channel.is_private;
      // setPassword("test__");
      if (passwordRef.current) passwordRef.current.value = channel.password;
      console.log("getChannel.password: ", channel.password);

      // Hack to redraw Autocomplete
      // https://stackoverflow.com/questions/59790956/material-ui-autocomplete-clear-value
      setUsersInputReset(channel.members);
      setAdminsInputReset(channel.admins);
    }
  }, [channel]);

  // on submit
  useEffect(() => {
    if (dataU) {
      console.log(dataU);
    }
    if (typeof dataM !== "undefined" || typeof dataU !== "undefined") {
      console.log("mutation: ", dataM);
      router.push("/channels");
    }
  }, [loadingM, loadingU]);

  // wait fetching data
  if (loadingR || loadingU) return <p>Loading user profile from graphql...</p>;
  if (errorR || errorU)
    return <p>Error: can't fetching data from graphql :(</p>;

  const isFormValid = (): boolean => {
    if (name !== "") {
      setIsNameValid(true);
    } else {
      setIsNameValid(false);
      nameRef.current.focus();
      return false;
    }
    if (
      typeof password === "undefined" ||
      password === "" ||
      password.length >= 6
    ) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
      passwordRef.current.focus();
      return false;
    }
    if (usersValue.length >= 2) {
      setIsUsersValid(true);
    } else {
      setIsUsersValid(false);
      return false;
    }
    if (adminsValue && adminsValue.length >= 1) {
      setIsAdminsValid(true);
    } else {
      setIsAdminsValid(false);
      return false;
    }
    return true;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    if (isFormValid()) {
      // convert Objects array to Array of [id]
      const membersIdArr = usersValue.reduce((a, { id }) => {
        if (id) a.push(id);
        return a;
      }, []);

      // convert Objects array to Array of [id]
      const adminsIdArr = adminsValue.reduce((a, { id }) => {
        if (id) a.push(id);
        return a;
      }, []);

      // console.log(
      //   name +
      //     ", " +
      //     membersIdArr.join("|") +
      //     ", " +
      //     isPrivate +
      //     ", " +
      //     password
      // );

      // send message to backend via mutation CREATE_CHAT_MUTATION
      console.log("pass before submit", password);
      if (slug === "create") {
        createChat({
          variables: {
            createChatCreateChatInput: {
              name: name,
              members: membersIdArr,
              admins: adminsIdArr,
              type: ChatType.Channel,
              is_private: isPrivate,
              ...((typeof password === "undefined" || password !== "") && {
                password: password,
              }),
            },
          },
        });
      } else {
        updateChat({
          variables: {
            updateChatInput: {
              id: channel.id,
              name: name,
              members: membersIdArr,
              admins: adminsIdArr,
              is_private: isPrivate,
              password: password,
              // ...((typeof password === "undefined" || password !== "") && {
              //   password: password,
              // }),
            },
          },
        });
      }
    }
  };

  // check router variable type
  if (typeof slug !== "string") return null;

  console.log(dataR.users);

  return (
    <InnerPageLayout>
      <div className="form">
        <Htag tag="h1">Edit channel</Htag>
        <form onSubmit={handleSubmit}>
          <div className="line">
            <TextField
              id="outlined-size-normal"
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
            <Autocomplete
              fullWidth
              multiple
              id="usersArr-tags"
              value={typeof usersValue == "undefined" ? [] : [...usersValue]}
              key={usersInputReset}
              onChange={(
                _event: React.ChangeEvent,
                newValue: IUserProfile[]
              ) => {
                setUsersValue(newValue);
              }}
              options={dataR.users}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    avatar={
                      <Avatar
                        alt={option.name}
                        src={
                          "http://" +
                          process.env.BACKEND_HOST +
                          "/public/" +
                          option.avatar[0]
                        }
                      />
                    }
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Users"
                  placeholder="Add user"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!isUsersValid}
                  helperText={
                    !isUsersValid
                      ? "Members must contain at least 2 elements!"
                      : " "
                  }
                />
              )}
            />
          </div>
          <div className="line">
            <Autocomplete
              fullWidth
              multiple
              id="admins-tags"
              value={typeof adminsValue == "undefined" ? [] : [...adminsValue]}
              key={adminsInputReset}
              onChange={(
                _event: React.ChangeEvent,
                newValue: IUserProfile[]
              ) => {
                setAdminsValue(newValue);
              }}
              options={dataR.users}
              getOptionLabel={(option) => option.name}
              getOptionSelected={(option, value) => option.name === value.name}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    avatar={
                      <Avatar
                        alt={option.name}
                        src={
                          "http://" +
                          process.env.BACKEND_HOST +
                          "/public/" +
                          option.avatar[0]
                        }
                      />
                    }
                    label={option.name}
                    {...getTagProps({ index })}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Admins"
                  placeholder="Add admin"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!isAdminsValid}
                  helperText={
                    !isAdminsValid
                      ? "Members must contain at least 1 elements!"
                      : " "
                  }
                />
              )}
            />
          </div>
          <div className="line">
            <FormControlLabel
              control={
                <Switch
                  checked={isPrivate}
                  onChange={(event) => setPrivate(event.target.checked)}
                  name="checkedA"
                  color="primary"
                  inputRef={privateRef}
                />
              }
              label="Private"
            />
          </div>
          {!isPrivate && (
            <div className="line">
              <TextField
                id="outlined-size-normal2"
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
                    ? "Password must be longer than or equal to 6 characters"
                    : " "
                }
              />
            </div>
          )}
          <div className="line">
            <Button appearance="primary">Submit</Button>
          </div>
        </form>
      </div>
    </InnerPageLayout>
  );
};

export default ChannelRoom;
