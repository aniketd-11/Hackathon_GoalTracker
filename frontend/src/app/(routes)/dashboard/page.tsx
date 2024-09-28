// "use client"
// import { useState } from 'react'
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  ExternalLink,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

// Mock data for the table
const accounts = [
  {
    id: 1,
    name: "Bank of America",
    note: "AirTable - Onboarding",
    status: "New",
    progress: 10,
    dueDate: "19 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "IBM",
    note: "Dunder Mifflin Paper - Raised $300M",
    status: "New",
    progress: 10,
    dueDate: "19 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Louis Vuitton",
    note: "FTX - Investment by Sequoia",
    status: "In-Progress",
    progress: 90,
    dueDate: "19 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 4,
    name: "The Walt Disney Company",
    note: "Airtable - Drop in treatment plan usage",
    status: "In-Progress",
    progress: 70,
    dueDate: "19 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 5,
    name: "General Electric",
    note: "SpaceX - Viewing documentation a lot",
    status: "New",
    progress: 10,
    dueDate: "19 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 6,
    name: "Apple",
    note: "Tesla - New product launch",
    status: "In-Progress",
    progress: 80,
    dueDate: "20 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 7,
    name: "Amazon",
    note: "Google - Cloud platform expansion",
    status: "New",
    progress: 10,
    dueDate: "20 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 8,
    name: "Microsoft",
    note: "Facebook - Metaverse development",
    status: "In-Progress",
    progress: 90,
    dueDate: "20 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 9,
    name: "Netflix",
    note: "Twitter - Algorithm changes",
    status: "New",
    progress: 10,
    dueDate: "20 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 10,
    name: "JPMorgan Chase",
    note: "Uber - IPO filing",
    status: "In-Progress",
    progress: 70,
    dueDate: "21 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 11,
    name: "Goldman Sachs",
    note: "Lyft - Driver shortage",
    status: "New",
    progress: 10,
    dueDate: "21 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 12,
    name: "Morgan Stanley",
    note: "Airbnb - New regulations",
    status: "In-Progress",
    progress: 90,
    dueDate: "21 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 13,
    name: "Wells Fargo",
    note: "DoorDash - Expansion plans",
    status: "New",
    progress: 10,
    dueDate: "21 Sep",
    avatar: "/placeholder.svg?height=32&width=32",
  },
];

export default function CRMDashboard() {
  return (
    <div className="min-h-screen p-8 ">
      <div className="bg-white rounded-xl shadow-lg  scroll-smooth ">
        <div className="p-6 space-y-4">
          <div className="flex justify-start gap-3">
            <Select>
              <SelectTrigger className="w-44 ">
                <SelectValue placeholder="All Projects" className="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed bid</SelectItem>
                <SelectItem value="t&m">T & M</SelectItem>
                <SelectItem value="staffing">Staffing</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="w-44 ">
                <SelectValue placeholder="Status" className=" " />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">In progress </SelectItem>
                <SelectItem value="dark">In review</SelectItem>
                <SelectItem value="system">Closed</SelectItem>
              </SelectContent>
            </Select>
            <Button className="" variant="outline">
              At risk
            </Button>
          </div>
          <div className="overflow-y-auto max-h-[70vh]">
            <table className="w-full">
              <thead className="sticky top-0 z-40 bg-white w-full">
                <tr className="bg-white w-full"></tr>
                <tr className="text-left bg-white">
                  <th className="p-3 font-normal">Project</th>
                  <th className="p-3 font-normal">Sprint/Milestone</th>
                  <th className="p-3 font-normal">Closed</th>
                  <th className="p-3 font-normal">Status</th>
                  <th className="p-3 font-normal">Progress</th>
                  <th className="p-3 font-normal">Due date</th>
                </tr>
              </thead>

              <tbody className="">
                {accounts.map((account) => (
                  <tr
                    key={account.id}
                    className="border-t border-gray-100 hover:bg-blue-50 rounded-2xl"
                  >
                    <td className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="font-medium">{account?.name}</span>
                        <ExternalLink size={16} className="text-gray-400" />
                      </div>
                    </td>
                    <td className="p-3 text-gray-500">{account.note}</td>
                    <td className="p-3">
                      {account.status === "New" ? (
                        <CheckCircle size={20} className="text-green-500" />
                      ) : (
                        <Clock size={20} className="text-gray-300" />
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          account.status === "New"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {account.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 rounded-full h-2"
                            style={{ width: `${account.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {account.progress}%
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">{account.dueDate}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center space-x-2 mt-4 sticky bottom-0">
            <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <ChevronUp size={20} />
            </button>
            <button className="px-3 py-1 button-active-default ">1</button>
            <button className="px-3 py-1 button-hover-default">2</button>
            <button className="px-3 py-1 button-hover-default">3</button>
            <button className="px-3 py-1 button-hover-default">4</button>
            <span className="text-gray-500">...</span>
            <button className="px-3 py-1 button-hover-default">8</button>
            <button className="p-2 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
              <ChevronDown size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
