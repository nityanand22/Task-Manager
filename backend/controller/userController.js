const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await db("user").where({ email });
    if (user.length > 0) {
      return res
        .status(400)
        .json({ status: false, message: "User already exists" });
    }
    if (!validator.isEmail(email)) {
      return res.status(400).json({ status: false, message: "Invalid email" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        status: false,
        message: "Password must be at least 6 characters long",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const [userId] = await db("user").insert({
      username,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: userId }, process.env.JWT_TOKEN_SECRET);
    return res
      .status(200)
      .json({ status: true, message: "User created successfully", token });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db("user").where({ email });
    if (user.length === 0) {
      return res
        .status(400)
        .json({ status: false, message: "User does not exist" });
    }

    const isPasswordValid = await bcrypt.compare(password, user[0].password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid password" });
    }
    const token = jwt.sign({ id: user[0].id }, process.env.JWT_TOKEN_SECRET);
    return res
      .status(200)
      .json({ status: true, message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  signup,
  login,
};
