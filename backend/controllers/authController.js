const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  try {
    console.log("BODY =>", req.body);
    console.log("FILE =>", req.file);

    const {
      name,
      email,
      password,
      role,
      specialization,
      phone,
      availability,
      age,
      gender,
      address,
      bloodGroup,
      medicalHistory,
      allergies,
      emergencyContact,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const profilephoto = req.file ? req.file.path : "";

    // Base user object
    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      profilephoto,
    };

    if (role === "doctor") {
      userData.specialization = specialization;
      userData.phone = phone;
      userData.availability = availability;
    }

    if (role === "patient") {
      userData.phone = phone;
      userData.age = age;
      userData.gender = gender;
      userData.address = address;
      userData.bloodGroup = bloodGroup;
      userData.medicalHistory =
        typeof medicalHistory === "string"
          ? medicalHistory.split(",")
          : medicalHistory;
      userData.allergies =
        typeof allergies === "string" ? allergies.split(",") : allergies;
      userData.emergencyContact = emergencyContact;
    }

    const user = new User(userData);
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

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const profile = { ...user._doc }; // Convert Mongoose doc to plain object

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
        age: profile.age,
        gender: profile.gender,
        address: profile.address,
        bloodGroup: profile.bloodGroup,
        medicalHistory: profile.medicalHistory,
        allergies: profile.allergies,
        emergencyContact: profile.emergencyContact,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
