const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user || user.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updatePatientProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findById(req.params.id);

    if (!user || user.role !== "patient") {
      return res.status(404).json({ error: "Patient not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
