"use client";
import { getCubes, deleteCube } from "@/services/CubeService";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Cube {
  id: string;
  description?: string;
  scramble: string;
  createdAt: string;
  isCompleted: boolean;
}

export default function ProfilePage() {
  const [cubes, setCubes] = useState<Cube[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCubes = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getCubes();
        console.log(res);
        setCubes(res);
      } catch (e: any) {
        console.error(e);
        setError("Could not load cubes.");
      } finally {
        setLoading(false);
      }
    };
    fetchCubes();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteCube(id);
      setCubes((prev) => prev.filter((c) => c.id !== id));
      setDeleteId(null);
    } catch (e) {
      alert("Failed to delete cube.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile</h1>
      <section className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Saved Cubes</h2>
        {loading ? (
          <div className="text-gray-500">Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : cubes.length === 0 ? (
          <div className="text-gray-500">No cubes saved yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Scramble</th>
                  <th className="px-4 py-2 text-left">Created At</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cubes.map((cube) => (
                  <tr
                    key={cube.id}
                    className="border-t border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-2">
                      {cube.description || (
                        <span className="text-gray-400 italic">
                          No description
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2 font-mono text-xs text-blue-700 break-all">
                      <Link
                        href={`/profile/cube/${cube.id}`}
                        className="underline hover:text-blue-900"
                      >
                        {cube.scramble}
                      </Link>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-500">
                      {new Date(cube.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        onClick={() => setDeleteId(cube.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {deleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this cube? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 disabled:opacity-50"
                onClick={() => handleDelete(deleteId)}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
