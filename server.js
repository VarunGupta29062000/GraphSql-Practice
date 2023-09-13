import { ApolloServer } from "apollo-server";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import typeDefs from "./SchemaGql.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to Mongoose");
});

mongoose.connection.on("error", (error) => {
  console.log("error connecting", error);
});

import "./models/Quotes.js";
import "./models/User.js";
import resolvers from "./resolvers.js";
import { JWT_SECRET, MONGO_URI } from "./config.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const { authorization } = req.headers;
    if (authorization) {
      const { userId } = jwt.verify(authorization, JWT_SECRET);
      return { userId };
    }
  },
  plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
});

server.listen().then((url) => {
  console.log(`Server listening on ${url.url}`);
});
