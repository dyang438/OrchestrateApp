"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
// Signup
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Cannot post empty password or username" });
  }
  const existingUser = await User_1.default.findOne({ username });
  if (existingUser) {
    console.error("Username is already in use.");
    return res.status(400).json({ message: "Username is already in use." });
  }
  const newUser = new User_1.default({ username, password });
  await newUser.save();
  // Set user info in session
  if (req.session) {
    req.session.user = { username: newUser.username };
  }
  console.log("Signup successful.");
  return res.status(201).json({ message: "Signup successful." });
});
// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User_1.default.findOne({ username });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  if (password !== user.password) {
    return res.status(401).json({ message: "Invalid password." });
  }
  if (req.session) {
    req.session.user = { username: user.username };
  }
  res.status(200).json({ message: "Login Successful" });
});
router.get("/current-user", (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ username: req.session.user.username });
  }
  res.status(404).json({ message: "No user logged in" });
});
// Logout
router.post("/logout", (req, res) => {
  req.session = null;
  res.status(200).json({ message: "logout successful." });
});
exports.default = router;
