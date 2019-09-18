import { prisma } from "../../../generated/prisma-client";
import dotenv from "dotenv";
dotenv.config(); //.env 파일 로드

const resolvers = {
  Query: {
    groups: async () => await prisma.groups(),
    group: async (_, args) => {
      const { id } = args;
      let groups = await prisma.group({ id: id });

      return groups;
    }
  },
  Mutation: {
    createGroup: async (_, args) => {
      const { name } = args.data;
      console.log("ccreateGroup", name);
      return await prisma.createGroup({ name: name });
    }
  },
  User: {
    async groupParticipants(parent) {
      // console.log(parent);
      return await prisma.group({ id: parent.id }).groupParticipants();
    }
  },
  Group: {
    async groupParticipants(parent) {
      // console.log("groupParticipants", parent);
      return await prisma.group({ id: parent.id }).groupParticipants();
    }
  },
  GroupParticipant: {
    async userId(parent) {
      // console.log("GroupParticipant", parent);
      return await prisma.groupParticipant({ id: parent.id }).userId();
    }
  }
};

export default resolvers;
