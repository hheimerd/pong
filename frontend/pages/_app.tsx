import '../styles/globals.css';
import Head from 'next/head';
import React from 'react';
import {AppProps} from 'next/dist/next-server/lib/router/router';
import theme from '../theme';
import { Provider } from 'next-auth/client'
import { ThemeProvider } from '@material-ui/core/styles';
import {CssBaseline} from "@material-ui/core";
import styles from "../styles/MainPage.module.css";
import {UserProfileContextProvider} from '../context/userprofile.context';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, [])


	return (
	<Provider session={pageProps.session}>
    <UserProfileContextProvider>
		<Head>
			<title>My Top</title>
			<link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap" rel="stylesheet"/>
		</Head>
		<ThemeProvider theme={theme}>
			{/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
			<CssBaseline />
			<Component {...pageProps} />
		</ThemeProvider>
    </UserProfileContextProvider>
	</Provider>
	);
}

export default MyApp;
