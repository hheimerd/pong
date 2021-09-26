import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { PersonalTokenContext } from "../../context/personaltoken/personaltoken.context";
import { VERIFY_TWOFA } from "../../graphql/queries";

const TwoFactor = (): JSX.Element => {
  const [verify2fa, { loading, data, error }] = useLazyQuery(VERIFY_TWOFA);
  const [twofactorMessage, setTwofactorMessage] = useState("");
  const { setToken } = useContext(PersonalTokenContext);
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const code = router.query.code as string;
      const auth_id = router.query.auth_id as string;
      if (typeof code !== "undefined" && typeof auth_id !== "undefined") {
        console.log("code from email link code:", code, ", auth_id:", auth_id);
        // write code sending graphql to verify2fa
        verify2fa({
          variables: {
            auth_id: auth_id,
            code: code,
          },
        });
      } else {
        setTwofactorMessage("No valid parameters in url.");
      }
    }
  }, [router.isReady]);

  // after submit code and auth_id to verify2fa
  useEffect(() => {
    if (typeof data !== "undefined") {
      console.log("data loading: ", data);
      if (data.login.access_token) {
        localStorage.setItem("token", data.login.access_token);
        setToken(data.login.access_token);
        if (localStorage.getItem("token") !== "") {
          console.log("localStorage token: ", localStorage.getItem("token"));
          router.push("/profile");
        }
      } else {
        console.log("message", data.login.message);
        setTwofactorMessage(data.login.message);
      }
    }
  }, [loading]);

  return (
    <>
      {error && <p className="error-message">Error: {error.message}</p>}
      {twofactorMessage && <p className="info-message"> {twofactorMessage} </p>}
    </>
  );
};

export default TwoFactor;
