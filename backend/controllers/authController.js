const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    console.log("BODY =>", req.body);
    console.log("FILE =>", req.file);

    const { name, email, password, role, specialization, phone, availability } =
      req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // Save profile photo path
    const profilephoto = req.file ? req.file.path : "";

    // Create User
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      profilephoto,
      specialization: role === "doctor" ? specialization : undefined,
      phone: role === "doctor" ? phone : undefined,
      availability: role === "doctor" ? availability : undefined,
    });

    await user.save();
    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Login
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Step 1: Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Step 2: Generate token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    let profile = { ...user._doc }; // Convert Mongoose doc to plain object
    // Step 4: Return complete user/doctor profile
    res.status(200).json({
      token,
      user: {
        _id: profile._id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        specialization: profile.specialization,
        phone: profile.phone,
        availability: profile.availability,
        profilephoto: profile.profilephoto,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
