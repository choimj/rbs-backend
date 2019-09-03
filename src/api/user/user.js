const Person = [
  {
    id: 1,
    name: "aaa",
    age: 18,
    gender: "female"
  },
  {
    id: 2,
    name: "bbb",
    age: 18,
    gender: "female"
  }
];

const resolvers = {
  Query: {
    people: () => Person,
    person: id => Person
  }
};

export default resolvers;
