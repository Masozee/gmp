"use client";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";

// Sample data for the data table
const sampleTableData = [
  {
    id: 1,
    header: "Latest Posts",
    type: "dynamic",
    status: "Done",
    target: "All",
    limit: "10",
    reviewer: "Admin",
  },
  {
    id: 2,
    header: "Featured Content",
    type: "static",
    status: "Done",
    target: "Homepage",
    limit: "5",
    reviewer: "Editor",
  },
  {
    id: 3,
    header: "User Submissions",
    type: "dynamic",
    status: "Pending",
    target: "Community",
    limit: "20",
    reviewer: "Moderator",
  },
];

export function DashboardClient() {
  return (
    <>
      {/* Analytics Chart */}
      <div className="mt-8">
        <ChartAreaInteractive />
      </div>
      
      {/* Data Table */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Content Management</h2>
        <DataTable data={sampleTableData} />
      </div>
    </>
  );
} 