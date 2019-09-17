import { prisma } from "../../../generated/prisma-client";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const resolvers = {
  Query: {
    users: async () => await prisma.users(),
    user: async (_, args) => await prisma.user({ email: args.email })
  },
  Mutation: {
    createUser: async (_, args) => {
      const { email, name, password } = args;
      const cryptoSecret = process.env.CRYPTO_SECRET;
      const cryptoPassword = crypto
        .createHmac("sha1", cryptoSecret)
        .update(password)
        .digest("base64");
      await prisma.createUser({
        email: email,
        name: name,
        password: cryptoPassword
      });
      return "success";
    },
    comparePassword: async (_, args) => {
      const { email, password } = args;
      const user = await prisma.user({
        email: email
      });
      if (user) {
        const compPassword = user.password;
        const cryptoSecret = process.env.CRYPTO_SECRET;
        const cryptoPassword = crypto
          .createHmac("sha1", cryptoSecret)
          .update(password)
          .digest("base64");
        if (cryptoPassword === compPassword) {
          user.flag = true;
          // console.log(user);
          return user;
        } else {
          user.flag = false;
          user.message = "비밀번호가 일치하지 않습니다.";
          return user;
        }
      } else {
        return { flag: false, message: "존재하지 않는 이메일입니다." };
      }
    },
    deleteSession: async (_, args) => {
      const { email, token } = args;
      const session = await prisma.deleteSession({
        email: email,
        token: token
      });

      return session;
    }
  }
};

export default resolvers;
