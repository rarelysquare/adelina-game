"use client";
import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  if (status === "loading") return <p className="p-8">Loading…</p>;

  return (
    <main className="min-h-screen bg-brand-50 p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-brand-700">Baby Trivia — Admin</h1>
          <button
            onClick={() => signOut({ redirectTo: "/admin/login" })}
            className="text-sm text-gray-500 hover:text-red-500"
          >
            Sign out
          </button>
        </div>

        <p className="text-sm text-gray-600">
          Signed in as <strong>{session?.user?.email}</strong>
        </p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => router.push("/admin/media")}
            className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg text-brand-700">Media Library</h2>
            <p className="text-sm text-gray-500 mt-1">
              Upload and manage photos and videos for the daily game.
            </p>
          </button>
          <button
            onClick={() => router.push("/admin/questions")}
            className="bg-white rounded-2xl shadow p-6 text-left hover:shadow-md transition"
          >
            <h2 className="font-semibold text-lg text-brand-700">Question Bank</h2>
            <p className="text-sm text-gray-500 mt-1">
              View, edit, and add trivia questions for Milestone Trivia and Raising Adelina.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
