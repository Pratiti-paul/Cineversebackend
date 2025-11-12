import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// export const signup = async (req, res) => {
//   try {
//     const { username, email, password } = req.body;

//     console.log("📝 Signup attempt:", { username, email });

//     if (!username || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Normalize email
//     const normalizedEmail = email.trim().toLowerCase();
//     const normalizedUsername = username.trim();

//     console.log("🔍 Checking for existing user with email:", normalizedEmail);
    
//     // Check if user already exists
//     const existingUser = await prisma.users.findUnique({ where: { email: normalizedEmail } });
//     console.log("🔍 Query result:", existingUser ? `Found user: ${existingUser.id}` : "No user found");
    
//     if (existingUser) {
//       console.log("❌ User already exists with email:", normalizedEmail);
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);
//     console.log("🔐 Password hashed");

//     // Create new user
//     console.log("💾 Creating user in database...");
//     const newUser = await prisma.users.create({
//       data: { 
//         username: normalizedUsername, 
//         email: normalizedEmail, 
//         password: hashedPassword 
//       },
//     });
//     console.log("✅ User created successfully:", { 
//       id: newUser.id, 
//       username: newUser.username, 
//       email: newUser.email
//     });

//     // Create JWT token
//     const token = jwt.sign(
//       { id: newUser.id, email: newUser.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(201).json({
//       message: "User created successfully",
//       token,
//       user: { id: newUser.id, username: newUser.username, email: newUser.email },
//     });
//   } catch (err) {
//     console.error("❌ Signup error:", err);
//     console.error("Error details:", {
//       message: err.message,
//       code: err.code,
//       meta: err.meta,
//     });
//     res.status(500).json({ 
//       message: "Signup failed", 
//       error: err.message 
//     });
//   }
// };


// export const login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const normalizedEmail = email.trim().toLowerCase();
//     const user = await prisma.users.findUnique({ where: { email: normalizedEmail } });
//     if (!user) return res.status(400).json({ message: "Invalid email" });

//     const validPassword = await bcrypt.compare(password, user.password);
//     if (!validPassword)
//       return res.status(400).json({ message: "Invalid password" });

//     const token = jwt.sign(
//       { id: user.id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.json({
//       message: "Login successful",
//       token,
//       user: { id: user.id, username: user.username, email: user.email },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ message: "Login failed", error: err.message });
//   }
// };




const JWT_SECRET = process.env.JWT_SECRET;
export const signup= async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ message: "User already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    // const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1d" });
    console.log("New user signed up:", user);
    res.status(200).json({message : "Lets go signedup", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error signing up", error });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ message: "User not found" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });
    
    // Set HTTP-only cookie for security
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    res.json({ 
      message: "Login successful",
      token, 
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Add logout function
export const logout = async (req, res) => {
  try {
    res.clearCookie('auth_token');
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error logging out", error });
  }
};

// Add function to verify if user is authenticated
export const verifyAuth = async (req, res) => {
  try {
    const token = req.cookies.auth_token || req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await prisma.user.findUnique({ 
      where: { id: decoded.id },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json({ user, token });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Invalid token" });
  }
};












