import React, { useEffect, useState } from "react";
import { Htag } from "../components";

export default function Home(): JSX.Element {
  const [token, setToken] = useState("");
  useEffect(() => {
    localStorage.clear();
    // get the authentication token from local storage if it exists
    setToken(localStorage.getItem("token"));
  });

  return (
    <div>
      <Htag tag="h1">Logout</Htag>
      <p>localStorage.getItem("token"): {token}</p>
    </div>
  );
}
