import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req, res) => {
  const newUser = await User.create(req.body);
  res.status(201).json(newUser);
};
