import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
// import styles from "../styles/MainPage.module.css";
import { UserProfileContextProvider } from "../context/userprofile/userprofile.context";
import "../styles/globals.css";
import theme from "../theme";
import { IChatMessage } from "../interfaces/message.interface";
// import client from './api/apollo-client'

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_REMOTE,
});

// manual token insert for user 1
// const token =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik1hcmdlIFNpbXBzb24iLCJlbWFpbCI6InRlc3QyQHRlc3QucnUiLCJsb2dpbiI6Im1hcmdlX3MiLCJyb2xlcyI6WyJ1c2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTMxVDE4OjE2OjQ4LjQ4MFoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0zMVQxODoxNjo0OC40ODBaIiwiYXZhdGFyIjpbXSwiaWF0IjoxNjI3NzU2NjM5LCJleHAiOjE2MjgzNjE0Mzl9.wzWT8Zyx_AaM026P5RFZK0eRzTIAzXr_5vHFxoERbYY";
// manual token insert for user 2
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ikl2YW4gUGV0cm92IiwiZW1haWwiOiJpdmFuMkB0ZXN0LnJ1IiwibG9naW4iOiJpdmFuX3AiLCJyb2xlcyI6WyJ1c2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTMxVDE4OjE3OjA3LjkyNloiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0zMVQxODoxNzowNy45MjZaIiwiYXZhdGFyIjpbXSwiaWF0IjoxNjI3ODQwNjM4LCJleHAiOjE2Mjg0NDU0Mzh9.n6w1qlgvlTajPspmT25iWUTBRFs8c4WvGZTP4y5b_X4";

const wsLink = process.browser
  ? new WebSocketLink({
      uri: "ws://localhost:3000/graphql",
      options: { reconnect: true },
    })
  : null;

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  // const token = localStorage.getItem('token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = process.browser
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      wsLink,
      httpLink
    )
  : httpLink;

const client = new ApolloClient({
  link: authLink.concat(splitLink),
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
