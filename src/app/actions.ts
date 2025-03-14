"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Secret Key for JWT Signing (Store in `.env` in production)
const SECRET_KEY = "mySuperSecretKey";

// ✅ Register User
export async function registerUser(data: FormData) {
  const name = data.get("name") as string;
  const email = data.get("email") as string;
  const password = data.get("password") as string;
  const role = data.get("role") as "ADMIN" | "USER";

  if (!name || !email || !password || !role) {
    return { error: "All fields are required." };
  }

  // Check if user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email already in use." };

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    return { message: "User registered successfully!" };
  } catch (error) {
    return { error: "Error registering user." };
  }
}

// ✅ Login User & Set Session Token
export async function loginUser(data: FormData) {
  const email = data.get("email") as string;
  const password = data.get("password") as string;

  if (!email || !password) return { error: "Email and password are required." };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: "User not found." };

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return { error: "Invalid credentials." };

  // Generate JWT Token
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
    expiresIn: "1h",
  });

  // Store JWT in HttpOnly Cookie
  cookies().set("token", token, { httpOnly: true });

  return { message: "Login successful!", role: user.role };
}

// ✅ Logout User (Clear JWT from Cookies)
export async function logoutUser() {
  cookies().delete("token");
  return { message: "Logged out successfully!" };
}

// ✅ Get Current Logged-in User
export async function getCurrentUser() {
  const token = cookies().get("token")?.value;
  if (!token) return null;

  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    return user
      ? { id: user.id, name: user.name, email: user.email, role: user.role }
      : null;
  } catch {
    return null;
  }
}

// ✅ Get All Users (Admin Only)
export async function getUsers() {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized. Admins only." };
  }

  return await prisma.user.findMany();
}

// ✅ Update User Name (Only Admin or the User themselves)
export async function updateUser(userId: string, newName: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { error: "Unauthorized. Please log in." };

  // Allow self-updates OR admins can update anyone
  if (currentUser.id !== userId && currentUser.role !== "ADMIN") {
    return { error: "Unauthorized. You can only update your own details." };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name: newName },
    });
    return { message: "User updated successfully!" };
  } catch (error) {
    return { error: "Error updating user." };
  }
}

// ✅ Delete User (Admin Only)
export async function deleteUser(userId: string) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return { error: "Unauthorized. Only Admins can delete users." };
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    return { message: "User deleted successfully!" };
  } catch (error) {
    return { error: "Error deleting user." };
  }
}
