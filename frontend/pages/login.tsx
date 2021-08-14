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
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ik1hcmdlIFNpbXBzb24iLCJlbWFpbCI6InRlc3QyQHRlc3QucnUiLCJsb2dpbiI6Im1hcmdlX3MiLCJyb2xlcyI6W10sImNyZWF0ZWRfYXQiOiIyMDIxLTA4LTE0VDA3OjM1OjUzLjUxMVoiLCJ1cGRhdGVkX2F0IjoiMjAyMS0wOC0xNFQwNzozNTo1My41MTVaIiwiYXZhdGFyIjpbXSwiZGVsZXRlZF9hdCI6bnVsbCwiaWF0IjoxNjI4OTI2NTk4LCJleHAiOjE2Mjk1MzEzOTh9.-FAc7xJ-PNrqxRfYQqXPNDfuC1s0FCEPwcyDMwNzaNw";
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
