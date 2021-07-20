import {getProviders, signIn, signOut, useSession} from 'next-auth/client';
import Image from 'next/image';
import pingPong from "../public/Ping_Pong_Icon.png";
import logo42 from "../public/42_Logo.svg";
import styles from "../styles/MainPage.module.css";
import {
  Box,
  Drawer,
  Grid,
  Button,
  ListItemText,
  List,
  ListItem,
  ListItemIcon,
  makeStyles,
  Avatar
} from "@material-ui/core";
import CheckIcon from '@material-ui/icons/Check';
import theme from "../theme";
import Router from "next/router";

import {gql, useMutation, useQuery} from "@apollo/client";
import client from "./api/apollo-client";

import {GET_USERS} from './api/queries/users';
import {CREATE_USER} from './api/mutations/users';
import {useEffect, useState} from 'react';







export default function MainPage({provider}) {
  // const [ session, loading ] = useSession();

  if (typeof window !== "undefined") {

  localStorage.setItem("token", 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiJoZXkiLCJlbWFpbCI6ImFiYXNAYXNmLmNvbSIsImxvZ2luIjoiaGV5aGV5Iiwicm9sZXMiOlsidXNlciJdLCJpYXQiOjE2MjY3OTczMTMsImV4cCI6MTYyNjgwMDkxM30.n3svM6ARXTN8fTxbEN9yQ2-3y3rvYyOt_oi_IuTA_Zs');
    
    }

  const {data, loading, error} = useQuery(GET_USERS, {variables: {
                                                        "usersOffset": 0,
                                                        "usersLimit": 0}
                                                      });
  const [users, setUsers] = useState([]);

  const [createUser] = useMutation(CREATE_USER);


  const _createUser = () => {
    createUser({
      variables: 
      {
        "createUserInput": {
          "name": "ahey",
          "email": "aabas@asf.com",
          "login": "aheyhey",
          "password": "aqweqfasdga13"
        }
      }
    }).then(({data}) => {
      console.log(data)
    })
  }
  useEffect(() => {
    if (!loading) {
      console.log(data)
      setUsers(data.users)
      // _createUser();
    }
  }, [data])

  const useStyles = makeStyles({
    item: {
      color: 'white',
      '& span, & svg': {
        fontSize: '1.9rem'
      }
    }
  });

  const classes = useStyles();

  if (loading) {
    return <h1>Loading...</h1>
  }



  const features = ['Играйте с друзьями в пинг понг',
    'Смотрите игры в онлайн режиме',
    'Повышайте  свой рейтинг',
    'Общайтесь с друзьями в чате'
  ];


  return <>
    {
        <>
          <div className={styles.bg}>
            <Box>

              <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={5}
                >
                  <div className={styles.title}>Пинг-понг</div>

                  <div className={styles.title_2}>Бесплатная Онлайн игра в пинг понг</div>

                  <List>
                    {
                      features.map(elem => {return (<ListItem button>
                        <ListItemIcon>
                          <CheckIcon style={{color: "orange"}} fontSize="large"/>
                        </ListItemIcon>
                        <ListItemText className={classes.item} primary={elem}/>
                      </ListItem>
                      );
                      }
                      )
                    }
                  </List>

                  <div className={styles.sign_in_school}>
                    <Button style={{color: "black", backgroundColor: "orange", marginTop:"40px",
                      maxWidth: '1000px', minWidth: '100%'}}
                    startIcon={<Image layout="fixed" width="65px" height="65px" src={logo42}/>}
                    onClick={() => {
                      try {
                        createUser(
                          {
                            variables: {
                              createUserInput: {
                                "name": "anullaaaaqqaaaa",
                                "email": "anull@nullqqqaa.com",
                                "login": "anullaaaaaqaqqa",
                                "password": "a  enullaaaaaaaawaaaaaaaaaaqq"
                              }
                            }
                          }).then(()=> console.log(data));
                      }
                      catch (e) {
                        {console.log(e);}
                      }
                    }
                    }

                      // Router.push('https://api.intra.42.fr/oauth/authorize?client_id=874cf6bced4726f43e3c5c674a133dbdf8d51cbf3c9476189828170183c98be5&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2F42-school&response_type=code')}
                    // onClick={() => signIn(provider.id)}
                    >
                      Вход через аккаунт Школы</Button>
                  </div>


                </Grid>
                <Grid item xs={5}>
                  <div className={styles.pp_icon}>
                    <Image  src={pingPong} alt="pingPong"/>
                  </div>
                </Grid>
                <Grid  item xs={1}/>
              </Grid>



              <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={4}>
                  <div className={styles.title_3}>Классический Pong 1972 года</div>
                </Grid>

                <Grid item xs={6}>
                  <div className={styles.decr_text}>
                        Pong — одна из ранних аркадных видеоигр. Это теннисная спортивная игра с использованием простой двумерной графики, разработанная и выпущенная фирмой Atari в 1972 году. Pong называют первой в истории коммерчески успешной видеоигрой, а с её именем связывают появление индустрии интерактивных развлечений.
                  </div>
                  <div className={styles.decr_text}>
                        Идею пинг-понга для создания игры предложил Нолан Бушнелл своему сотруднику, программисту Аллану Алькорну. В то время у Аллана не было опыта разработки игр, и Pong стал для него тренировочным проектом. Идея пинг-понга для видеоигр в то время уже была реализована в Magnavox Odyssey, и это привело к иску против Atari.
                  </div>
                </Grid>

                <Grid item xs={1}/>
              </Grid>
          <div>
            {users.map(user => <div> {user.name} </div>)}
          </div>

            </Box>
          </div>


        </>
    }


    {
      // For logged in
    }
    {/* {session && <>
      <Drawer
        variant="temporary"
        ModalProps={{
          keepMounted: true,
        }}
      />
            Signed in as {session.user.name} <br/>
      <button onClick={() => signOut()}>Sign out</button>
    </>} */}
  </>;
}

// export async function getServerSideProps(context){
//   const providers = await getProviders();
//   const provider = providers['42-school'];
//
//   return {
//     props: { provider }
//   };
// }

// export async function getStaticProps() {
//
//   addTodo({ variables: { type: input.value } });
//
//   const { data } = await client.mutation({
//     mutation: gql`
//         mutation($createUserInput: CreateUserDto!)  {
//           createUser(input: $createUserInput) {
//             id
//           }
//         }
//       `,
//   });
//
//   return {
//     props: {
//       countries: data.countries.slice(0, 4),
//     },
//   };
// }
