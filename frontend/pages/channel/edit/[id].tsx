import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import Chip from '@material-ui/core/Chip';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {FormControlLabel, Switch} from '@material-ui/core';
import {Button, Htag} from '../../../components';
import styles from './edit.module.css';

interface Users {
  name: string;
  id: number;
}

const usersArr: Array<Users> = [
  { name: 'Anna',       id: 1 },
  { name: 'Andrey',     id: 2 },
  { name: 'Pavel',      id: 3 },
  { name: 'Ekaterina',  id: 4 },
  { name: 'Michael',    id: 5 },
  { name: 'Boris',      id: 6 },
  { name: 'Elena',      id: 7 },
];

const ChannelRoom = (): JSX.Element => {
  const router = useRouter();
  // channel id
  const { id } = router.query;
  // form fields
  const [usersValue, setUsersValue] = React.useState<Array<Users>>([usersArr[3], usersArr[5]]);
  const [adminsValue, setAdminsValue] = React.useState<Array<Users>>([usersArr[1]]);
  const [isPrivate, setPrivate] = React.useState(false);
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const fetchInitialFormData = () => {
    return 'Artur';
  };

  useEffect(() => {
    setName(fetchInitialFormData);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    console.log(name + ", " + usersValue.join(", ") + ", " + adminsValue.join(", ") + ", " + isPrivate + ", " + password);
  };

  // check router variable type
  if (typeof id !== "string") return null;

  return (
    <div className={styles.form}>
      <Htag tag='h1'>Edit channel id: {id}</Htag>
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
          />
        </div>
        <div className={styles.line}>
          <Autocomplete fullWidth multiple id="usersArr-tags" value={usersValue}
            onChange={(_event: React.ChangeEvent, newValue: Users[]) => {
              setUsersValue([
                ...newValue,
              ]);
            }}
            options={usersArr}
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
            onChange={(_event: React.ChangeEvent, newValue: Users[]) => {
              setAdminsValue([
                ...newValue,
              ]);
            }}
            options={usersArr}
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
