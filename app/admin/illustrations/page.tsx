"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";

interface Illustration {
  id: number;
  name: string;
  url: string;
  active: number;
  is_builtin: number;
}

export default function IllustrationsPage() {
  const { status } = useSession();
  const router = useRouter();
  const [illustrations, setIllustrations] = useState<Illustration[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newName, setNewName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/admin/login");
  }, [status, router]);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/illustrations");
    if (res.ok) {
      const data = await res.json();
      setIllustrations(data.illustrations);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (status === "authenticated") load();
  }, [status]);

  async function toggleActive(ill: Illustration) {
    await fetch(`/api/admin/illustrations/${ill.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: ill.active ? 0 : 1 }),
    });
    load();
  }

  async function handleDelete(ill: Illustration) {
    if (!confirm(`Delete "${ill.name}"?`)) return;
    await fetch(`/api/admin/illustrations/${ill.id}`, { method: "DELETE" });
    load();
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file || !newName.trim()) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", newName.trim());
    const res = await fetch("/api/admin/illustrations", { method: "POST", body: formData });
    if (!res.ok) {
      const d = await res.json();
      alert(d.error ?? "Upload failed");
    } else {
      setNewName("");
      if (fileRef.current) fileRef.current.value = "";
      load();
    }
    setUploading(false);
  }

  if (status === "loading") return <p className="p-8">Loading…</p>;

  const active = illustrations.filter((i) => i.active);
  const inactive = illustrations.filter((i) => !i.active);

  return (
    <main className="min-h-screen bg-brand-50 p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push("/admin")} className="text-sm text-gray-500 hover:text-brand-600">
            ← Admin
          </button>
          <h1 className="text-2xl font-bold text-brand-700">Illustrations</h1>
          <span className="text-sm text-gray-400 ml-auto">{active.length} active / {illustrations.length} total</span>
        </div>

        {/* Upload new */}
        <div className="bg-white rounded-2xl shadow p-5 space-y-3">
          <h2 className="font-semibold text-brand-700">Add new illustration</h2>
          <form onSubmit={handleUpload} className="flex flex-wrap gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">Name (slug, e.g. "waving")</label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="waving"
                className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">PNG file</label>
              <input ref={fileRef} type="file" accept="image/png" className="text-sm" />
            </div>
            <button
              type="submit"
              disabled={uploading || !newName.trim()}
              className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : "Upload"}
            </button>
          </form>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading…</p>
        ) : (
          <>
            {/* Active */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Active ({active.length})</h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {active.map((ill) => (
                  <div key={ill.id} className="bg-white rounded-2xl shadow p-3 flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={ill.url} alt={ill.name} className="w-20 h-20 object-contain" />
                    <p className="text-xs text-gray-600 text-center leading-tight">{ill.name}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleActive(ill)}
                        className="text-xs text-gray-400 hover:text-brand-600"
                      >
                        Disable
                      </button>
                      <button
                        onClick={() => handleDelete(ill)}
                        className="text-xs text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive */}
            {inactive.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">Disabled ({inactive.length})</h2>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 opacity-50">
                  {inactive.map((ill) => (
                    <div key={ill.id} className="bg-white rounded-2xl shadow p-3 flex flex-col items-center gap-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ill.url} alt={ill.name} className="w-20 h-20 object-contain grayscale" />
                      <p className="text-xs text-gray-400 text-center leading-tight">{ill.name}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleActive(ill)}
                          className="text-xs text-brand-500 hover:text-brand-700"
                        >
                          Enable
                        </button>
                        <button
                          onClick={() => handleDelete(ill)}
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
