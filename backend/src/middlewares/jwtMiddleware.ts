import jwt from "jsonwebtoken";
import express, { Request, Response, NextFunction } from "express";

// Create a type for User object in decoded token if it has specific properties
interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Extend the Request type to include the user property
    }
  }
}

const app = express();

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Token not found");
    }
    const decoded = jwt.verify(token, "your_jwt_secret") as UserPayload;
    req.user = decoded; // Add decoded token to request object
    next();
  } catch (error) {
    res.status(401).send("Please authenticate");
  }
};

app.get("/secure", auth, (req: Request, res: Response) => {
  res.send("This is a secure route");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
