"use client";

import { useEffect, useState } from "react";
import { getUsers, registerUser, loginUser, logoutUser, getCurrentUser } from "./actions";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [role, setRole] = useState("USER");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  useEffect(() => {
    async function fetchCurrentUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // If the logged-in user is an Admin, fetch all users
      if (currentUser?.role === "ADMIN") {
        const fetchedUsers = await getUsers();
        if (!fetchedUsers.error) {
          setUsers(fetchedUsers);
        }
      }
    }
    fetchCurrentUser();
  }, []);

  async function handleRegister(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("email", newEmail);
    formData.append("password", newPassword);
    formData.append("role", role);

    const response = await registerUser(formData);
    alert(response.message || response.error);
    setNewName("");
    setNewEmail("");
    setNewPassword("");
  }

  async function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData();
    formData.append("email", loginEmail);
    formData.append("password", loginPassword);

    const response = await loginUser(formData);
    alert(response.message || response.error);
    setUser(await getCurrentUser());
  }

  async function handleLogout() {
    await logoutUser();
    setUser(null);
    setUsers([]); // Clear users list on logout
  }

  return (
    <main className="p-6">
      {user ? (
        <div>
          <p>Welcome, {user.name} ({user.role})</p>
          <button onClick={handleLogout} className="bg-red-500 text-white p-2">Logout</button>
        </div>
      ) : (
        <>
          <h2 className="text-xl font-bold mt-6">Register</h2>
          <form onSubmit={handleRegister} className="mt-4">
            <input type="text" placeholder="Name" value={newName} onChange={(e) => setNewName(e.target.value)} required className="border p-2 mr-2" />
            <input type="email" placeholder="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required className="border p-2 mr-2" />
            <input type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required className="border p-2 mr-2" />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border p-2 mr-2">
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit" className="bg-blue-500 text-white p-2">Register</button>
          </form>

          <h2 className="text-xl font-bold mt-6">Login</h2>
          <form onSubmit={handleLogin} className="mt-4">
            <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="border p-2 mr-2" />
            <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="border p-2 mr-2" />
            <button type="submit" className="bg-purple-500 text-white p-2">Login</button>
          </form>
        </>
      )}

      {/* Show user list only if logged-in user is an admin */}
      {user?.role === "ADMIN" && (
        <div>
          <h2 className="text-xl font-bold mt-6">All Users (Admin Only)</h2>
          <ul>
            {users.map((u) => (
              <li key={u.id}>
                {u.name} ({u.email})
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
