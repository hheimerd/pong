import axios from "axios";
import { useRouter } from "next/router";

function getAccessToken(code: string) {
  console.log("token");
  console.log(`${process.env.ACCESS_TOKEN_URL_42}`);
  const bodyFormData = new FormData();

  bodyFormData.append("grant_type", "authorization_code");
  bodyFormData.append(
    "client_id",
    "874cf6bced4726f43e3c5c674a133dbdf8d51cbf3c9476189828170183c98be5"
  );
  bodyFormData.append(
    "client_secret",
    "2f8f9fd78e51df4f69d6934c009e8fff9b5fe291c79dfc22dbfd4cc1b29a249a"
  );
  bodyFormData.append("code", `${code}`);
  bodyFormData.append("redirect_uri", "http://localhost:3040/intra_callback");

  axios({
    method: "post",
    url: "https://api.intra.42.fr/oauth/token",
    data: bodyFormData,
    headers: { "Content-Type": "multipart/form-data" },
  })
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      return error;
    });
  return "resp";
}

function ActiveLink() {
  const router = useRouter();

  const { code } = router.query;

  if (router.isReady) {
    const resp = getAccessToken(code.toString());
    console.log(resp);
  }
  return <h1>{code}</h1>;
}

export default ActiveLink;
