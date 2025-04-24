"use client";

import React from "react";
import { Calendar } from "@/components/ui/calendar";

import { useState } from "react";
import type { DateRange } from "react-day-picker";

const mockEvents: Record<string, { title: string; description: string }[]> = {
  "2025-04-24": [
    { title: "Team Meeting", description: "Discuss project updates." },
    { title: "Task Review", description: "Review delegated tasks." },
  ],
  "2025-04-25": [
    { title: "Submit Report", description: "Send weekly report to manager." },
  ],
};

const DashboardCalendarPage = () => {
  const [selected, setSelected] = useState<Date | undefined>(new Date());
  const selectedKey = selected ? selected.toISOString().slice(0, 10) : "";
  const events = mockEvents[selectedKey] || [];

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6">
      <div className="flex-1 flex justify-center items-start">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Calendar</h1>
          <Calendar
            mode="single"
            selected={selected}
            onSelect={setSelected}
            className="w-full"
            classNames={{
              day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100 text-base", // Make days bigger
            }}
          />
        </div>
      </div>
      <div className="flex-1 min-w-[300px]">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Events for {selectedKey}</h2>
          {events.length === 0 ? (
            <div className="text-gray-500">No events for this day.</div>
          ) : (
            <ul className="space-y-4">
              {events.map((event, idx) => (
                <li key={idx} className="border rounded p-3 bg-gray-50">
                  <div className="font-bold">{event.title}</div>
                  <div className="text-gray-600 text-sm">{event.description}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardCalendarPage;
