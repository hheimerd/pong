import { useMutation, useQuery } from '@apollo/client';
import { Chip, FormControlLabel, Switch } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useRouter } from 'next/router';
import React, { useEffect, useRef } from 'react';
import { Button, Htag } from '../../../components';
import { CHATS_QUERY, CREATE_CHAT_MUTATION, USERS_QUERY } from '../../../graphql';
import { ChatType, IChat } from '../../../interfaces/chat.interface';
import { IUserProfile } from '../../../interfaces/userprofile.interface';
import styles from './edit.module.css';

const ChannelRoom = (): JSX.Element => {
  const { data: dataR, error: errorR, loading: loadingR } = useQuery(USERS_QUERY, { variables: {usersOffset: 0, usersLimit: 100}});
  const [createChat, { data: dataM, loading: loadingM, error: errorM }] = useMutation(CREATE_CHAT_MUTATION);
  const { loading, error, data } = useQuery(CHATS_QUERY);
  const router = useRouter();
  const { slug } = router.query;

  // states for form fields
  const [usersValue, setUsersValue] = React.useState<Array<IUserProfile>>();
  const [usersInputReset, setUsersInputReset] = React.useState('');
  const [adminsValue, setAdminsValue] = React.useState<Array<IUserProfile>>();
  const [adminsInputReset, setAdminsInputReset] = React.useState('');
  const [isPrivate, setPrivate] = React.useState(false);
  const [name, setName] = React.useState('');
  const nameRef = useRef();
  const [password, setPassword] = React.useState('');

  // get current channel from current user profile
  const getChannel = () => {
    const channel = data.getProfile.chats.filter(
      (x: IChat) => x.id === slug
    )[0];
    return channel;
  };

  // on loading CHATS_QUERY
  useEffect(() => {
    if (!loading && slug !== "create")
    {
      setName(getChannel().name);
      // update name input field default value
      if (nameRef.current)
        nameRef.current.value = getChannel().name;
      setUsersValue(getChannel().members);
      // hack to redraw Autocomplete
      // https://stackoverflow.com/questions/59790956/material-ui-autocomplete-clear-value
      setUsersInputReset(getChannel().members);
      setAdminsValue(getChannel().admins);
      setAdminsInputReset(getChannel().admins);
    }
  }, [loading]);

  // on submit
  useEffect(() => {
    if (typeof dataM !== "undefined") {
      console.log("mutation: ", dataM);
      router.push('/channels');
    }
  }, [loadingM]);

  // wait fetching data
  if (loading || loadingR) return <p>Loading user profile from graphql...</p>;
  if (error || errorR) return <p>Error: can't fetching data from graphql :(</p>;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (name === "") return;

    // convert Objects array to Array of [id]
    const membersIdArr = usersValue.reduce((a, {id}) => {  
        if (id) a.push(id);
        return a;  
    }, []);

    // send message to backend via mutation CREATE_CHAT_MUTATION
    if (slug === "create") {
      createChat({
        variables: {
          createChatCreateChatInput: {
            name: name,
            members: membersIdArr,
            type: ChatType.Channel,
            is_private: false
          },
        },
      });
    }

    // console.log(name + ", " + usersValue.join(", ") + ", " + adminsValue.join(", ") + ", " + isPrivate + ", " + password);

  };

  // check router variable type
  if (typeof slug !== "string") return null;

  return (
    <div className={styles.form}>
      <Htag tag='h1'>Edit channel</Htag>
      <form onSubmit={handleSubmit}>
        <div className={styles.line}>
          <TextField 
            id="outlined-size-normal" 
            label="Name" 
            fullWidth 
            size="small" 
            variant="outlined"
            onChange={event => setName(event.target.value)} 
            InputLabelProps={{
              shrink: true,
            }}
            defaultValue={name}
            inputRef={nameRef}
          />
        </div>
        <div className={styles.line}>
          <Autocomplete fullWidth multiple id="usersArr-tags" value={usersValue}
            key={usersInputReset}
            onChange={(_event: React.ChangeEvent, newValue: IUserProfile[]) => {
              setUsersValue([
                ...newValue,
              ]);
            }}
            options={dataR.users}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField{...params}
                label="Users"
                placeholder="Add user" 
                variant="outlined" 
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
        <div className={styles.line}>
          <Autocomplete fullWidth multiple id="admins-tags" value={adminsValue}
            key={adminsInputReset}
            onChange={(_event: React.ChangeEvent, newValue: IUserProfile[]) => {
              setAdminsValue([
                ...newValue,
              ]);
            }}
            options={dataR.users}
            getOptionLabel={(option) => option.name}
            getOptionSelected={(option, value) => option.name === value.name}
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField{...params}
                label="Admins"
                placeholder="Add admin" 
                variant="outlined" 
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </div>
        <div className={styles.line}>
          <FormControlLabel 
            control={
              <Switch 
                checked={isPrivate}
                onChange={event => setPrivate(event.target.checked)} 
                name="checkedA" 
                color="primary"
              />
            }
            label="Private" />
        </div>
        { isPrivate ? 
          <div className={styles.line}>
            <TextField id="outlined-size-normal2" label="Password" fullWidth 
              size="small"
              type="password"
              variant="outlined"
              InputLabelProps={{ shrink: true, }}
              onChange={event => setPassword(event.target.value)}
            />
          </div>
          : null 
        }
        <div className={styles.line}>
          <Button appearance="primary">Submit</Button>
        </div>
      </form>
    </ div>
  );
};

export default ChannelRoom;
