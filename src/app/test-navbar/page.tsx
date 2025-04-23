"use client";

import { Navbar } from "@/components/Navbar";

export default function TestNavbarPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow p-10">
        <h1 className="text-2xl font-bold">Navbar Test Page</h1>
        <p className="mt-4">This page tests if the Navbar component renders correctly.</p>
      </main>
    </div>
  );
} 