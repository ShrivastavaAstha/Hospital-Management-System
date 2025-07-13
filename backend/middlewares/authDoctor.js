const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // decoded should contain an `id`
    next();
  } catch (err) {
    console.error("❌ Invalid token:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
