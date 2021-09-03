import axios from "axios";
import { useRouter } from "next/router";

function getAccessToken(code: string) {
  console.log("token");
  console.log(`${process.env.ACCESS_TOKEN_URL_42}`);
  const bodyFormData = new FormData();
  bodyFormData.append("code", `${code}`);
  const token = axios({
    method: "POST",
    url: "http://localhost:3000/auth/login42",
    data: bodyFormData,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (resp) {
      console.log("resp.data: ", resp.data);
      console.log("resp.status: ", resp.status);
      return resp;
    })
    .catch(function (err) {
      if (err.response) {
        console.error("Error:", err.config, err.response.data);
      }
      return err;
    });
  return token;
}

function ActiveLink() {
  const router = useRouter();

  const { code } = router.query;

  if (router.isReady) {
    const resp = getAccessToken(code.toString());
    console.log("resp", resp);
  }
  return <h1>{code}</h1>;
}

export default ActiveLink;
