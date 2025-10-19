import { Request, Response, NextFunction } from "express";

const RequireAuth = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.session || !req.session.user || req.session.user === "") {
    const err = new Error("No active session");
    res.status(401);
    next(err);
  } else {
    next();
  }
};

export default RequireAuth;
