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
      return await prisma.createGroup({ name: name });
    },
    createGroupParticipant: async (_, args) => {
      const { groupId, userId, name } = args.data;
      // console.log("createGroupParticipant>>", name, groupId, userId);
      return await prisma.createGroupParticipant({
        groupId: {
          connect: {
            id: groupId
          }
        },
        userId: {
          connect: {
            id: userId
          }
        },
        name: name
      });
    },
    updateGroup: async (_, args) => {
      const { id, name, groupParticipants } = args.data;
      await prisma.deleteManyGroupParticipants({
        AND: [{ groupId: { id: id } }]
      });
      groupParticipants.forEach(async element => {
        await prisma.createGroupParticipant({
          groupId: {
            connect: {
              id: element.groupId
            }
          },
          userId: {
            connect: {
              id: element.userId
            }
          },
          name: element.name
        });
      });

      return await prisma.updateGroup({
        where: { id: id },
        data: {
          name: name
        }
      });
    },
    deleteGroup: async (_, args) =>
      await prisma.deleteGroup({ id: args.data.id })
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
