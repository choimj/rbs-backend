import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    users: () => prisma.users(),
    user: (_, args) => prisma.user({ email: args.email })
  },
  Mutation: {
    createUser: async (_, args) => {
      const { email, name, password } = args;
      await prisma.createUser({
        email: email,
        name: name,
        password: password
      });
      // console.log(args);
      return "success";
    },
    comparePassword: async (_, args) => {
      // console.log(args);
      const { email, password } = args;
      const user = await prisma.user({
        email: email
      });
      // console.log(user);
      const compPassword = user.password;
      if (password === compPassword) {
        // console.log("aaaa");
        user.message = "aaa";
        console.log(user);

        return user;
      } else {
        return user;
      }
    }
  }
};

export default resolvers;
