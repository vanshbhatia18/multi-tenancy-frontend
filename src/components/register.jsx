import React, { useState } from "react";
import { saveToken, setUserIdentity } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Register({ }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantSlug, setTenantSlug] = useState("");
  const [role, setRole] = useState("MEMBER");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  async function submit(e) {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, tenantSlug, role }),
      });
      const data = await res.json();
      console.log(data, "the data is")
      if (!res.ok) throw data;
      saveToken(data.token);
      const newObj = {
        username: data.data.username,
        role: data.data.role,
        companyName: data.data.tenantId.name
      }
      setUserIdentity(newObj)
      navigate("/app")
    } catch (err) {
      setError(err?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Register</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">username</label>
            <input
              type="username"
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Tenant Slug</label>
            <input
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500"
              placeholder="e.g. acme"
              value={tenantSlug}
              onChange={e => setTenantSlug(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select
              className="w-full mt-1 p-2 border rounded-lg focus:ring focus:ring-blue-500"
              value={role}
              onChange={e => setRole(e.target.value)}
            >
              <option value="MEMBER">Member</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="#/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}
