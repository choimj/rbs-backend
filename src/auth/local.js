import { prisma } from "../../generated/prisma-client";
import LocalStrategy from "passport-local";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

export default new LocalStrategy.Strategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true
  },
  async () => {
    /**
     * email, password 맞는지 검사
     */
    const user = await prisma.user({ email: email, password: password });
    let returnArr = {};
    console.log("LocalStrategy====================");
    if (user === null) {
      returnArr = {
        flag: false,
        message: "이메일 또는 비밀번호를 확인해주세요.",
        data: {
          email: email
        }
      };
    } else {
      returnArr = {
        flag: true,
        message: "",
        data: {
          email: email
        }
      };
    }

    return done(null, returnArr);
  }
);
