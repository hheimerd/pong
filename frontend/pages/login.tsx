import React, { useEffect, useState } from "react";
import { Htag } from "../components";

export default function Home(): JSX.Element {
  const [token, setToken] = useState("");
  useEffect(() => {
    // Marge
    // const token =
    //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik1hcmdlIFNpbXBzb24iLCJlbWFpbCI6InRlc3QyQHRlc3QucnUiLCJsb2dpbiI6Im1hcmdlX3MiLCJyb2xlcyI6W10sImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTA3VDE4OjM0OjAzLjUxNloiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wOC0wN1QxODozNDowMy41MTdaIiwiYXZhdGFyIjpbXSwiaWF0IjoxNjI4MzYxMzkzLCJleHAiOjE2Mjg5NjYxOTN9.SD4Te0CeLMCWA_Tl5nyPzrwT26R8icdv6eyxpv4ZQ_I";
    //   Ivan
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwibmFtZSI6Ikl2YW4gUGV0cm92IiwiZW1haWwiOiJpdmFuMkB0ZXN0LnJ1IiwibG9naW4iOiJpdmFuX3AiLCJyb2xlcyI6W10sImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTA3VDE4OjM1OjM1LjIyMVoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wOC0wN1QxODozNTozNS4yMjJaIiwiYXZhdGFyIjpbXSwiZGVsZXRlZF9hdCI6bnVsbCwiaWF0IjoxNjI4NTcyNTE1LCJleHAiOjE2MjkxNzczMTV9.tV5feD1OQ09BQNX6rHA2Ksmd0ZBI8TRqhxZoZ11BUf4";
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
