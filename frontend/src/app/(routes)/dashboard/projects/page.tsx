/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SidebarLayout from "@/app/sidebar-layout";
import Layout from "@/components/Layout/Layout";
import Skeleton from "@/components/LoadingSkeleton/Skeleton";
import dynamic from "next/dynamic";
import { getProjectsForDM } from "@/services/projectServiceDM";
import { useAppSelector } from "@/redux/hooks";
import { RootState } from "@/redux/store";
import { GoalTrackerForm } from "@/components/Projects/CreateGoalDialog/GoalTrackerForm";
import SelectTemplate from "@/components/Projects/CreateGoalDialog/SelectTemplate";
import TableHeading from "@/components/Projects/Static/TableHeading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";

type GoalTracker = {
  trackerId: number;
  goalTrackerName: string;
  startDate: string;
  endDate: string;
  status: string | null;
  rating: string | null;
  actions: string | null;
};

type Project = {
  projectId: number;
  projectName: string;
  templateType: string;
  goalTrackers: GoalTracker[];
};

const ProfessionalDashboard = () => {
  const [Isloading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [template, setTemplate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  // Check if user is authenticated
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    try {
      const response: Project[] = await getProjectsForDM(user?.email);

      // Assuming the response returns an array of accounts
      if (Array.isArray(response)) {
        // setAccounts(response); // Fix here to update with actual response data

        setProjects(response);

        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log("Error fetching accounts:", error);
    }
  }

  return (
    <>
      <Layout>
        <SidebarLayout>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[88vh]">
              <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-800 mb-6">
                  Project Dashboard
                </h1>
                {Isloading ? (
                  <Skeleton />
                ) : (
                  <>
                    <div className="flex flex-wrap justify-between">
                      <div className="flex flex-wrap justify-start gap-3">
                        <Select>
                          <SelectTrigger className="w-44 bg-blue-50 border-blue-200 hover:border-blue-300 focus:ring-blue-500">
                            <SelectValue placeholder="All projects" />
                          </SelectTrigger>
                          <SelectContent>
                            {projects.map((project) => (
                              <SelectItem
                                key={project?.projectId}
                                value={project?.projectName}
                              >
                                {project?.projectName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <SelectTemplate setTemplate={setTemplate} />
                        <Button
                          variant="outline"
                          className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                        >
                          At risk
                        </Button>
                      </div>

                      <div>
                        {/* Form for new goal */}

                        <GoalTrackerForm
                          projects={projects}
                          fetchProjects={fetchProjects}
                        />
                      </div>
                    </div>
                    <div className="overflow-x-auto overflow-y-auto max-h-[66vh]">
                      <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg">
                          <table className="min-w-full divide-y divide-blue-200 ">
                            <TableHeading />
                            <tbody className="bg-white divide-y divide-blue-200">
                              {projects.map((project) => {
                                // If no goalTrackers, display a single row with placeholders
                                if (project.goalTrackers.length === 0) {
                                  return (
                                    <tr
                                      key={project.projectId}
                                      className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                    >
                                      <td className="table-cell">
                                        <div className="flex items-center">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          <div className="ml-4">
                                            <div className="text-sm font-medium text-blue-900">
                                              {project?.projectName}
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="table-cell text-sm text-blue-700">
                                        -
                                      </td>
                                      <td className="table-cell text-sm text-blue-700">
                                        {(() => {
                                          switch (project.templateType) {
                                            case "T_M":
                                              return "T & M";
                                            case "FIXED_BID":
                                              return "Fixed bid";
                                            case "STAFFING":
                                              return "Staffing";
                                            default:
                                              return (
                                                project.templateType || "-"
                                              ); // Fallback if no match
                                          }
                                        })()}
                                      </td>
                                      <td className="table-cell text-sm text-blue-700">
                                        -
                                      </td>
                                      <td className="table-cell text-sm text-blue-700">
                                        -
                                      </td>
                                      <td className="table-cell text-sm text-blue-700">
                                        -
                                      </td>
                                    </tr>
                                  );
                                }

                                // Map over goalTrackers if they exist
                                return project.goalTrackers.map(
                                  (tracker, index) => (
                                    <tr
                                      key={tracker.trackerId}
                                      className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                    >
                                      {/* Display projectName only in the first row of each project's goal trackers */}
                                      <td className="table-cell">
                                        {index === 0 && (
                                          <div className="flex items-center">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <div className="ml-4">
                                              <div className="text-sm font-medium text-blue-900">
                                                {project?.projectName}
                                              </div>
                                            </div>
                                          </div>
                                        )}
                                      </td>
                                      <td className="table-cell">
                                        <div className="text-sm text-blue-700 flex items-center gap-2">
                                          {tracker.goalTrackerName || "-"}
                                          {(tracker?.status === "INITIATED" ||
                                            tracker?.status ===
                                              "IN_PROGRESS") && (
                                            <TooltipProvider>
                                              <Tooltip>
                                                <TooltipTrigger>
                                                  <Link href="/fill-goal-details">
                                                    <ExternalLink className="text-gray-500 w-4 h-4 cursor-pointer" />
                                                  </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p>Fill tracker details</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            </TooltipProvider>
                                          )}
                                        </div>
                                      </td>
                                      <td className="table-cell">
                                        <div className="text-sm text-blue-700">
                                          {(() => {
                                            switch (project.templateType) {
                                              case "T_M":
                                                return "T & M";
                                              case "FIXED_BID":
                                                return "Fixed bid";
                                              case "STAFFING":
                                                return "Staffing";
                                              default:
                                                return (
                                                  project.templateType || "-"
                                                ); // Fallback if no match
                                            }
                                          })()}
                                        </div>
                                      </td>
                                      <td className="table-cell">
                                        <span className="text-sm text-blue-700">
                                          {(() => {
                                            switch (tracker.status) {
                                              case "INITIATED":
                                                return "Initiated";
                                              case "IN_REVIEW":
                                                return "In Review";
                                              case "IN_PROGRESS":
                                                return "In Progress";
                                              case "IN_CLOSURE":
                                                return "In Closure";
                                              case "CLOSED":
                                                return "Closed";
                                              default:
                                                return "No status";
                                            }
                                          })()}
                                        </span>
                                      </td>
                                      <td className="table-cell">
                                        <div className="text-sm text-blue-700">
                                          {tracker.startDate
                                            ? new Date(
                                                tracker.startDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "-"}
                                        </div>
                                      </td>
                                      <td className="table-cell">
                                        <div className="text-sm text-blue-700">
                                          {tracker.endDate
                                            ? new Date(
                                                tracker.endDate
                                              ).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "short",
                                                year: "numeric",
                                              })
                                            : "-"}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                    {projects?.length > 10 && (
                      <div className="flex justify-center items-center space-x-2 mt-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) => Math.max(prev - 1, 1))
                          }
                          className="pagination-button"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        {[...Array(totalPages)].map((_, i) => (
                          <Button
                            key={i}
                            variant={
                              currentPage === i + 1 ? "default" : "outline"
                            }
                            className={`px-3 py-1 ${
                              currentPage === i + 1
                                ? "bg-blue-600 text-white"
                                : "text-blue-600 hover:bg-blue-100"
                            }`}
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </Button>
                        ))}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            )
                          }
                          className="pagination-button"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </SidebarLayout>
      </Layout>
    </>
  );
};

export default dynamic(() => Promise.resolve(ProfessionalDashboard), {
  ssr: false,
});
