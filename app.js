const express = require("express");
const app = express();

const { ApolloServer, gql } = require("apollo-server-express");
const mongoose= require("mongoose");
const UsersCollection = require("./UserSchema");
const ProductsCollection = require("./ProductSchema");

mongoose.connect("mongodb://127.0.0.1:27017/graphql-data",()=>console.log("connected to DB"))

const typeDefs = gql`
  type ProductType {
    id: ID!
    title: String!
    price: Int
  }
  type UserType {
    id: ID!
    name: String!
    age: Int!
    products: [ProductType]
  }
  type Query {
    users: [UserType]
    user(id: ID): UserType
    products: [ProductType]
    product(id: ID): ProductType
  }
  type Mutation {
    addUser(name: String!, age: Int!): UserType
    updateUser(name: String, age: Int): UserType
    addProduct(title:String!,price:Int!,userId:ID):ProductType
  }
  type Subscription {
    newUser: UserType
  }
`;

const resolvers = {
  Query: {
    users: async (parent) => {
  const users = await UsersCollection.find().populate("products")
      return users;
    },
    user:  async (parent, args, context, info) => {
      const user=await UsersCollection.findById(args.id).populate("products")
      return user
    },
    products:  async (parent, args) => {
      const products= await ProductsCollection.find()
      return products;
    },
    product:  async (parent, args) => {
      const product= await ProductsCollection.findById(args.id)
      return product
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = new UsersCollection(args)
      return await user.save()
    },
    updateUser: async(_, args) => {
      const updatedUser=await UsersCollection.findByIdAndUpdate(args.id,{...args},{new:true})
      return updatedUser;
    },
    addProduct: async(_,args,context)=>{
      const product=new ProductsCollection({...args})
       await product.save();
      const user=await UsersCollection.findById(args.userId)
      user.products.push(product._id);
      await user.save()
      return product
    }
  },
  Subscription: {},
};

const server = new ApolloServer({ typeDefs, resolvers });
server.start().then(() => {
  server.applyMiddleware({ app });
});

app.listen(3000, () => console.log(`apolloo server is running: 4000`));
