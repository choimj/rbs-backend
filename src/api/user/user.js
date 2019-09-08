import { prisma } from "../../../generated/prisma-client";

const resolvers = {
  Query: {
    users: () => prisma.users(),
    user: (_, args) => prisma.user({ email: args.email })
  },
  Mutation: {
    createUser: async (_, args) => {
      await prisma.createUser({
        email: args.email,
        name: args.name,
        password: args.password
      });
      // console.log(args);
      return "success";
    }
  }
};

export default resolvers;
