import "../styles/globals.css";
import Head from "next/head";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { AppProps } from "next/dist/next-server/lib/router/router";
import theme from "../theme";
import { Provider } from "next-auth/client";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline } from "@material-ui/core";
// import styles from "../styles/MainPage.module.css";
import { UserProfileContextProvider } from "../context/userprofile/userprofile.context";
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import client from './api/apollo-client'

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_REMOTE,
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // manual token insert
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6InRlc3QiLCJlbWFpbCI6InRlc3QyQHRlc3QucnUiLCJsb2dpbiI6InRlc3QxMjMiLCJyb2xlcyI6WyJ1c2VyIl0sImlhdCI6MTYyNjk2OTgyMywiZXhwIjoxNjI2OTczNDIzfQ.r5HipcpV8mrIc3wsgMS-FM9gWmFrjn3fLfxIITIFOkQ";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ApolloProvider client={client}>
      <Provider session={pageProps.session}>
        <UserProfileContextProvider>
          <Head>
            <title>My Top</title>
            <link rel="icon" href="/favicon.ico" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link
              rel="preconnect"
              href="https://fonts.gstatic.com"
              crossOrigin="true"
            />
            <link
              href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
              rel="stylesheet"
            />
          </Head>
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UserProfileContextProvider>
      </Provider>
    </ApolloProvider>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
