import jwt from "jsonwebtoken";

export const genToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_KEY, { expiresIn: "7d" });
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    samesite: "strict",
    secure: process.env.NODE_ENV !== "dev",
  });
  return token;
};

