import { gql } from "apollo-server-core";

const typeDefs = gql`
  type Query {
    user(_id: ID!): User
    users: [User]
    quotes: [Quotes]
  }

  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    password: String
    quotes: [Quotes]
  }

  type Quotes {
    name: String
    by: ID
  }

  type Token{
    token:String
  }

  type Mutation {
    signupUser(userNew: userInput!): User
    signinUser(userSignin: userSignInInput!): Token
  }

  input userInput {
    firstName: String!
    lastName: String!
    email: String!
    password: String!
  }

  input userSignInInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
