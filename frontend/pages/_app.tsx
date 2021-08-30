import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
  split,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
// import client from './api/apollo-client'
import { onError } from "@apollo/client/link/error";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { CssBaseline } from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import { Provider } from "next-auth/client";
import { AppProps } from "next/dist/next-server/lib/router/router";
import Head from "next/head";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useRef } from "react";
import {
  PersonalTokenContext,
  PersonalTokenContextProvider,
} from "../context/personaltoken/personaltoken.context";
import { SnackBarProvider } from "../context/snackbar/snackbar.context";
// import styles from "../styles/MainPage.module.css";
import { UserProfileContextProvider } from "../context/userprofile/userprofile.context";
import "../styles/globals.css";
import theme from "../theme";

const httpLink = createHttpLink({
  uri: process.env.GRAPHQL_REMOTE,
});

const wsLink = process.browser
  ? new WebSocketLink({
      uri: process.env.WEBSOCKET_LINK,
      options: { reconnect: true },
    })
  : null;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    console.log("[graphQLErrors]: ", graphQLErrors);
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
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

const getApolloClient = (token: string) => {
  token = `Bearer ${token}`;
  const authLink = setContext((_, { headers }) => {
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(errorLink).concat(splitLink),
    cache: new InMemoryCache(),
  });
};

const ApolloClientProvider = (props: any) => {
  const { token } = useContext(PersonalTokenContext);
  const tokenRef = useRef();

  // Whenever the token changes, the component re-renders, thus updating the ref.
  tokenRef.current = token;
  console.log("[app.tsx] token: ", tokenRef.current);
  // Ensure that the client is only created once.
  // const client = useMemo(() => {
  //   return getApolloClient(tokenRef.current);
  // }, [tokenRef]);
  const client = getApolloClient(tokenRef.current);
  return <ApolloProvider client={client} {...props} />;
};

function MyApp(props: AppProps): JSX.Element {
  const { Component, pageProps } = props;
  // const [token, setToken] = useState("");

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    // get the authentication token from local storage if it exists
    // setToken(localStorage.getItem("token"));
  }, []);

  return (
    <PersonalTokenContextProvider>
      <ApolloClientProvider>
        <Provider session={pageProps.session}>
          <UserProfileContextProvider>
            <SnackBarProvider>
              <Head>
                <title>Pong Online</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                  rel="preconnect"
                  href="https://fonts.gstatic.com"
                  crossOrigin="true"
                />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                  href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;700&display=swap"
                  rel="stylesheet"
                />
              </Head>
              <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline />
                <Component {...pageProps} />
              </ThemeProvider>
            </SnackBarProvider>
          </UserProfileContextProvider>
        </Provider>
      </ApolloClientProvider>
    </PersonalTokenContextProvider>
  );
}

export default MyApp;

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
