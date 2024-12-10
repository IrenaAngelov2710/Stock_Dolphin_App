const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

module.exports = {
  loginUser: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      // Compare the password with the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid credentials" });
      }
      console.log('JWT_SECRET:', JWT_SECRET);
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: "5h",
      });

      const { password: _, ...userWithoutPassword } = user.toObject(); // Exclude the password field
      res.json({ token, user: userWithoutPassword });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
  registerUser: async (req, res) => {
    const { email, password, name } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      // Create a new user instance
      const newUser = new User({
        name, 
        email,
        password, 
      });

      await newUser.save();
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
  },
};