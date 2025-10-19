"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = __importDefault(require("body-parser"));
const accountRoutes_1 = __importDefault(require("./routes/accountRoutes"));
const postRoutes_1 = __importDefault(require("./routes/postRoutes"));
const socketHandlers_1 = require("./socketHandlers");
// read environment variables from .env file
dotenv_1.default.config();
const PORT = process.env.PORT ?? 8000;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
  cors: {
    origin: "*", // Adjust according to your frontend deployment
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});
app.use(
  (0, cookie_session_1.default)({
    name: "session",
    keys: ["k1", "k2"],
    maxAge: 24 * 60 * 60 * 1000,
  }),
);
app.use(body_parser_1.default.json());
// export const manager = new NlpManager();
// manager.load('model.nlp');  // Load the pre-trained model
const MONGO_URI = process.env.MONGODB_URI ?? "";
mongoose_1.default.connect(MONGO_URI).catch((error) => {
  console.error("MongoDB connection error:", error.message);
});
// define root route
app.get("/", (_, res) => {
  res.json({ message: "Hello, frontend!" });
});
app.get("/api/bye", (_, res) => {
  return res.json({ message: "Bye, frontend!" });
});
app.get("/api/hello", (_, res) => {
  return res.json({ message: "Hello, frontend!" });
});
// account routes
app.use("/api/account", accountRoutes_1.default);
// question routes
app.use("/api/post", postRoutes_1.default);
io.on("connection", (socket) => {
  console.log("A user connected");
  // In your socket connection handler in the server setup:
  socket.on("request-all-posts", () =>
    (0, socketHandlers_1.getAllPosts)(socket),
  );
  socket.on("request-post", (postId) =>
    (0, socketHandlers_1.handleRequestPost)(socket, postId),
  );
  socket.on("new-comment", (data) =>
    (0, socketHandlers_1.handleNewComment)(io, data.postId, data),
  );
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
// listen
server.listen(PORT, () => {
  console.log(`Now listening on port ${PORT}.`);
});
