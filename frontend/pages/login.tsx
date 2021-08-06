import React, { useEffect, useState } from "react";
import { Htag } from "../components";

export default function Home(): JSX.Element {
  const [token, setToken] = useState("");
  useEffect(() => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ikl2YW4gUGV0cm92IiwiZW1haWwiOiJpdmFuMkB0ZXN0LnJ1IiwibG9naW4iOiJpdmFuX3AiLCJyb2xlcyI6WyJ1c2VyIl0sImNyZWF0ZWRfYXQiOiIyMDIxLTA3LTMxVDE4OjE3OjA3LjkyNloiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wNy0zMVQxODoxNzowNy45MjZaIiwiYXZhdGFyIjpbXSwiaWF0IjoxNjI3ODQwNjM4LCJleHAiOjE2Mjg0NDU0Mzh9.n6w1qlgvlTajPspmT25iWUTBRFs8c4WvGZTP4y5b_X4";

    localStorage.setItem("token", token);
    setToken(localStorage.getItem("token"));
  });

  return (
    <div>
      <Htag tag="h1">Login</Htag>
      <p>localStorage.getItem("token"): {token}</p>
    </div>
  );
}
