import NextAuth from 'next-auth';
import Providers from 'next-auth/providers';
import axios from "axios";

export default NextAuth({

  // Configure one or more authentication providers

  providers: [
    Providers.FortyTwo({
      clientId: process.env.CLIENT_ID_42,
      clientSecret: process.env.CLIENT_SECRET_42
    })
    // Providers.Credentials({
    //     id: '2fa',
    //     name: "Two Factor Auth",
    //     async authorize(credentials, req) {
    //         console.log(credentials)
    //         const user = { /* add function to get user */ }
    //         return user
    //     },
    //     credentials: {
    //         "2fa-key": {  label: "2FA Key" }
    //     },
    // }),
    /* ... additional providers ... /*/
  ],

  callbacks: {
    /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @return {boolean|string}  Return `true` to allow sign in
         *                           Return `false` to deny access
         *                           Return `string` to redirect to (eg.: "/unauthorized")
         */
    async signIn(user, account, profile) {
      // console.log(user)
      // console.log(account)

      const response = await axios.get(`${process.env.API_URL}/isEnabled2FA`, user);
      const isEnabled2FA = response.data.value;
      if (!isEnabled2FA) {
        return true;
      } else {
        const response = await axios.post(`${process.env.API_URL}/need2FA`, user);
        return true;
      }
    }
  },


  session: {
    jwt: true,
    encryption: true
  }
});
