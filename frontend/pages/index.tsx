import {getProviders, signIn, signOut, useSession} from 'next-auth/client'
import Image from 'next/image'
import pingPong from "../public/Ping_Pong_Icon.png"
import styles from "../styles/MainPage.module.css"
import {Box, Drawer, Grid, Button} from "@material-ui/core";

export default function MainPage({provider}) {
    const [ session, loading ] = useSession()

    return <>
        {!session &&
        <>
        <Box  className={styles.bg}>

            <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={8}>
                    <div className={styles.title}>Пинг-понг</div>
                </Grid>
                <Grid item xs={3}>
                    {/*<div className={styles.pp_icon}>*/}
                    {/*    <Image src={pingPong} alt="pingPong" />*/}
                    {/*</div>*/}
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={8}>
                    <div className={styles.title_2}>Бесплатная Онлайн игра в пинг понг</div>
                </Grid>
                <Grid item xs={3}/>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={5}>
                    <Button variant="contained" size={"large"} color={"primary"} onClick={() => signIn(provider.id)}>Sign in with {provider.name}</Button>
                </Grid>
                <Grid item xs={6}/>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={5}>
                    <div className={styles.title_3}>Классический Pong 1972 года</div>
                </Grid>
                <Grid item xs={6}/>
            </Grid>

            <Grid container spacing={2}>
                <Grid item xs={1}/>

                <Grid item xs={4}>
                    <div className={styles.game_field}></div>
                </Grid>
                <Grid item xs={7}>
                    <div className={styles.decr_text}>
                        Pong — одна из ранних аркадных видеоигр. Это теннисная спортивная игра с использованием простой двумерной графики, разработанная и выпущенная фирмой Atari в 1972 году. Pong называют первой в истории коммерчески успешной видеоигрой, а с её именем связывают появление индустрии интерактивных развлечений.
                        Идею пинг-понга для создания игры предложил Нолан Бушнелл своему сотруднику, программисту Аллану Алькорну. В то время у Аллана не было опыта разработки игр, и Pong стал для него тренировочным проектом. Идея пинг-понга для видеоигр в то время уже была реализована в Magnavox Odyssey, и это привело к иску против Atari.
                    </div>
                </Grid>
            </Grid>


        </Box>
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