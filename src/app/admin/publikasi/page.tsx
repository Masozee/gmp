"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Publication {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  content: string;
  publicationdate: string;
  coverimage: string;
  imagecredit: string;
  published: number;
  categoryid: string;
  createdat: string;
  updatedat: string;
}

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/publikasi");
      const json = await res.json();
      if (res.ok) {
        setPublications(json.data || []);
      } else {
        setError(json.error || "Failed to fetch publications");
      }
    } catch {
      setError("Failed to fetch publications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this publication?")) return;
    
    try {
      const res = await fetch(`/api/admin/publikasi/${id}`, {
        method: "DELETE",
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete publication");
      }
      
      // Refresh the list after delete
      fetchPublications();
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("An unknown error occurred while deleting");
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Link href="/admin/publikasi/create" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Create New</Link>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b">Title</th>
                <th className="px-4 py-2 border-b">Slug</th>
                <th className="px-4 py-2 border-b">Published</th>
                <th className="px-4 py-2 border-b">Publication Date</th>
                <th className="px-4 py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {publications.length === 0 ? (
                <tr>
                  <td className="px-4 py-4 border-b text-center" colSpan={5}>
                    No publications found. <Link href="/admin/publikasi/create" className="text-blue-600 hover:underline">Create one</Link>
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr key={pub.id}>
                    <td className="px-4 py-2 border-b">{pub.title}</td>
                    <td className="px-4 py-2 border-b">{pub.slug}</td>
                    <td className="px-4 py-2 border-b">{pub.published ? "Yes" : "No"}</td>
                    <td className="px-4 py-2 border-b">{pub.publicationdate ? new Date(pub.publicationdate).toLocaleDateString() : "-"}</td>
                    <td className="px-4 py-2 border-b">
                      <Link href={`/admin/publikasi/edit/${pub.id}`} className="text-blue-600 hover:underline mr-4">Edit</Link>
                      <button 
                        onClick={() => handleDelete(pub.id)} 
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 