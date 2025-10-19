"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token not found");
    }
    const decoded = jsonwebtoken_1.default.verify(token, "your_jwt_secret");
    req.user = decoded; // Add decoded token to request object
    next();
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};
app.get("/secure", auth, (req, res) => {
  res.send("This is a secure route");
});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
