import GoogleStrategy from "passport-google-oauth";
import { prisma } from "../../generated/prisma-client";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

export default new GoogleStrategy.OAuth2Strategy(
  {
    clientID: process.env.PASSPORT_GOOGLE_OAUTH_CLIENT_ID,
    clientSecret: process.env.PASSPORT_GOOGLE_OAUTH_CLIENT_SECRET,
    callbackURL: process.env.PASSPORT_GOOGLE_OAUTH_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails[0].value;

    const user = await prisma.user({ email: email });
    let returnArr = {};
    // console.log("user====================");

    if (user === null) {
      // 회원이 아닌 경우 회원가입 페이지로 redirect
      // console.log("not member!!");
      returnArr = {
        flag: false,
        data: {
          email: email
        }
      };
    } else {
      // 회원인 경우 로그인 후 main 페이지로 redirect
      // console.log("member!!");
      returnArr = {
        flag: true,
        data: user
      };
    }

    return done(null, returnArr);
  }
);
