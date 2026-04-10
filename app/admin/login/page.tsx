"use client";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-brand-50">
      <div className="text-center space-y-6 p-8 bg-white rounded-2xl shadow-lg max-w-sm w-full">
        <h1 className="text-2xl font-bold text-brand-700">Admin Login</h1>
        <p className="text-gray-500 text-sm">
          Sign in with the Google account that owns the photo album.
        </p>
        <button
          onClick={() => signIn("google", { redirectTo: "/admin" })}
          className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 px-6 rounded-xl transition"
        >
          Sign in with Google
        </button>
      </div>
    </main>
  );
}
