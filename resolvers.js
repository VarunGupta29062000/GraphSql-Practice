import mongoose from "mongoose";
// import { users, quotes } from "./fakedb.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
const User = mongoose.model("User");

const resolvers = {
  // Query: {
  //   users: () => users,
  //   user: (_, { _id }) => users.find((user) => user._id === _id),
  //   quotes: () => quotes,
  // },
  // User: {
  //   quotes: (ur) => quotes.filter((q) => q.by == ur._id),
  // },
  Mutation: {
    signupUser: async (_, { userNew }) => {
      // const _id = randomBytes(5).toString("hex");
      // users.push({
      //   _id,
      //   ...userNew
      // });

      // return users.find((user) => user._id === _id);

      //We are checking if the email already exis in the database
      const user = await User.findOne({ email: userNew.email });
      if (user) {
        throw new Error("User Already Registered");
      }

      //we are encrypting the password using bcrypt method and 12 specifies that ye itni baar jaake encrypt hpga taki apka password bahut secure rhe hamesha
      const hashedpassword = await bcrypt.hash(userNew.password, 12);

      const newUser = new User({
        ...userNew,
        password: hashedpassword,
      });

      return await newUser.save();
    },
    signinUser: async (_, { userSignin }) => {
      const user = await User.findOne({ email: userSignin.email });
      if (!user) {
        throw new Error("User doesnt exist with that email");
      }

      const doMatch = await bcrypt.compare(userSignin.password, user.password);
      if (!doMatch) {
        throw new Error("User does not exist with that password");
      }
      const token = jwt.sign({ userId: user._id }, JWT_SECRET);
      return { token };
    },
  },
};

export default resolvers;
