import {getProviders, signIn, signOut, useSession} from 'next-auth/client'
import Image from 'next/image'
import pingPong from "../public/Ping_Pong_Icon.png"
import logo42 from "../public/42_Logo.svg"
import styles from "../styles/MainPage.module.css"
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

export default function MainPage({provider}) {
    const [ session, loading ] = useSession()

    const useStyles = makeStyles({
        item: {
            color: 'white',
            '& span, & svg': {
                fontSize: '1.9rem'
            }
        }
    });

    const classes = useStyles();

    let features = ['Играйте с друзьями в пинг понг',
        'Смотрите игры в онлайн режиме',
        'Повышайте  свой рейтинг',
        'Общайтесь с друзьями в чате'
    ];


    return <>
        {!session &&
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
                            )
                            }
                        )
                    }
                    </List>

                    <div className={styles.sign_in_school}>
                        <Button style={{color: "black", backgroundColor: "orange", marginTop:"40px",
                            maxWidth: '1000px', minWidth: '100%'}}
                                startIcon={<Image layout="fixed" width="65px" height="65px" src={logo42}/>}
                                onClick={() => signIn(provider.id)}>Вход через аккаунт Школы</Button>
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


        </Box>
        </div>
        </>
        }


        {
            // For logged in
        }
        {session && <>
            <Drawer
                variant="temporary"
                ModalProps={{
                    keepMounted: true,
                }}
            />
            Signed in as {session.user.name} <br/>
            <button onClick={() => signOut()}>Sign out</button>
        </>}
    </>
}

export async function getServerSideProps(context){
    const providers = await getProviders()
    const provider = providers['42-school']

    return {
        props: { provider }
    }
}