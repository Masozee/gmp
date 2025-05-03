"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CreatePublicationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: "", // Usually auto-generated, but schema shows it's a string
    title: "",
    slug: "",
    abstract: "",
    content: "",
    publicationdate: new Date().toISOString().split("T")[0], // Default to today's date
    coverimage: "",
    imagecredit: "",
    published: 0, // Default to unpublished
    categoryid: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue = value;
    
    // Convert checkbox value to number (0 or 1)
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      processedValue = checkbox.checked ? "1" : "0";
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Format the date for the API
    const apiData = {
      ...formData,
      publicationdate: new Date(formData.publicationdate).toISOString(),
      published: parseInt(formData.published.toString(), 10)
    };

    try {
      const res = await fetch("/api/admin/publikasi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(apiData)
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create publication");
      }
      
      // Redirect to publications list
      router.push("/admin/publikasi");
      router.refresh();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Create New Publication</h1>
        <Link href="/admin/publikasi" className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition">
          Cancel
        </Link>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title*</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="slug" className="block text-gray-700 font-medium mb-2">Slug*</label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="publicationdate" className="block text-gray-700 font-medium mb-2">Publication Date*</label>
            <input
              type="date"
              id="publicationdate"
              name="publicationdate"
              value={formData.publicationdate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="categoryid" className="block text-gray-700 font-medium mb-2">Category ID*</label>
            <input
              type="text"
              id="categoryid"
              name="categoryid"
              value={formData.categoryid}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="coverimage" className="block text-gray-700 font-medium mb-2">Cover Image URL*</label>
            <input
              type="text"
              id="coverimage"
              name="coverimage"
              value={formData.coverimage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="imagecredit" className="block text-gray-700 font-medium mb-2">Image Credit</label>
            <input
              type="text"
              id="imagecredit"
              name="imagecredit"
              value={formData.imagecredit}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              id="published"
              name="published"
              checked={formData.published === 1}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="published" className="ml-2 block text-gray-700">Published</label>
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="abstract" className="block text-gray-700 font-medium mb-2">Abstract*</label>
          <textarea
            id="abstract"
            name="abstract"
            value={formData.abstract}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content*</label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="text-right">
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Creating...' : 'Create Publication'}
          </button>
        </div>
      </form>
    </div>
  );
} 