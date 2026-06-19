"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For Next.js 13+ app directory. Use 'next/router' for pages directory.
import { useMutation } from "@tanstack/react-query";
import { register } from '../../services/auth/AuthServices'; // Ensure this import exists and is correct
import Providers from "@/provider/QueryClientProvider";
import { formatUSPhoneInput, getUSPhoneDigits } from "@/helpers/phoneFormat";

// Define the RegisterData type if not imported from elsewhere
type RegisterData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone: string;
  uuid?: string;
};

export default function RegistrationPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const registerMutation = useMutation({
    mutationFn: (user: RegisterData) => register(user),

    onSuccess: (data) => {
      console.log("registerd successfully:", data);
      window.location.href = "/login";

    },
    onError: (error) => {
      console.error("Error  while registration:", error);
    },
  });
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (getUSPhoneDigits(phone).length !== 10) {
      setError("Please enter a valid 10-digit US phone number");
      return;
    }

    setLoading(true);

    // TODO: Replace with your real registration API call
    // Simulate API delay

    if (email && password && name && phone) {
      let data = {
        name: name,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
        phone: getUSPhoneDigits(phone),
        uuid: process.env.NEXT_PUBLIC_REALTY_PRO_AGENT_ID
      }
      registerMutation.mutate(data)
      // setSuccess("Registration successful! Redirecting to login...");
      // setTimeout(() => {
      //   router.push("/login");
      // }, 1500)
    } else {
      setError("Registration failed. Please fill all fields.");
    }
    setLoading(false);
  };

  return (
    <Providers>

      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleRegister}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
          {error && (
            <div className="mb-4 text-[#b3261e] text-center">{error}</div>
          )}
          {success && (
            <div className="mb-4 text-[#2e7d32] text-center">{success}</div>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c2a878]"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              autoFocus
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c2a878]"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Phone</label>
            <input
              type="tel"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c2a878]"
              value={phone}
              onChange={e => setPhone(formatUSPhoneInput(e.target.value))}
              maxLength={14}
              placeholder="(555) 123-4567"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c2a878]"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 font-medium">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#c2a878]"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#c2a878] text-white font-bold py-2 rounded hover:bg-[#957a4b] transition"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-[#c2a878] hover:underline">
              Already have an account? Login
            </a>
          </div>
        </form>
      </div>
    </Providers>
  );
}