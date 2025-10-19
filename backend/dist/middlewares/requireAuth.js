"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RequireAuth = (req, res, next) => {
  if (!req.session || !req.session.user || req.session.user === "") {
    const err = new Error("No active session");
    res.status(401);
    next(err);
  } else {
    next();
  }
};
exports.default = RequireAuth;
