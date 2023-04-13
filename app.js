require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const { model } = require("mongoose");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("./model/user");
const isAuth = require("./middleware/auth");
const app = express();
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("all good");
});

app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    if (!(firstName && lastName && email && password)) {
      res.status(400).send("all fields required");
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).send("already registered");
    }

    const myEncyptedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: myEncyptedPassword,
    });

    //   token
    const token = jwt.sign(
      {
        user_id: user._id,
        email,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );

    user.token = token;
    user.password = undefined;
    res.status(201).json(user);
  } catch (error) {
    console.log(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send("fill fields");
    }
    const user = await User.findOne({ email });
    // if (!user) {
    //   res.status(400).send("You are not registered yet!!!");
    // }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user_id: user._id,
          email,
        },
        process.env.SECRET_KEY,
        {
          expiresIn: "2h",
        }
      );
      user.token = token;
      user.password = undefined;
      // res.status(200).send(user);

      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.status(200).cookie("token", token, options).json({
        success: true,
        token,
        user,
      });
    }
    res.status(400).send("You are not registered yet!!!");
  } catch (error) {
    console.log(error.message);
  }
});

app.get("/dashboard", isAuth, (req, res) => {
  res.status(201).send("your private data");
});
module.exports = app;
