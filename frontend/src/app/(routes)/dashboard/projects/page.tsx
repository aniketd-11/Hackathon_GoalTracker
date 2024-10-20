/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
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

import { useAppDispatch } from "@/redux/hooks";
import {
  setTrackerId,
  setTrackerStatus,
} from "@/redux/slices/trackerDetailsSlice";
import { useRouter } from "next/navigation";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { changeStatusService } from "@/services/changeStatusService";
import SelectProject from "@/components/Projects/CreateGoalDialog/SelectProject";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  // TableCell,
  // TableHead,
  // TableHeader,
  // TableRow,
} from "@/components/ui/table";

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
  const [template, setTemplate] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const dispatch = useAppDispatch();
  const route = useRouter();

  // Check if user is authenticated
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filters when either selectedProject or template changes
    applyFilters();
  }, [selectedProject, template]);

  const applyFilters = () => {
    let filtered = [...projects];

    if (selectedProject) {
      filtered = filtered.filter(
        (project) => project.projectId === selectedProject.id
      );
    }

    if (template) {
      filtered = filtered.filter(
        (project) => project.templateType === template
      );
    }

    setFilteredProjects(filtered);
    setIsFiltered(selectedProject !== null || template !== null);
  };

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

  const handleRedirect = (status: string, id: number) => {
    dispatch(setTrackerId(id));
    dispatch(setTrackerStatus(status));
    if (status === "IN_REVIEW") {
      route.push("/view-goal-details");
    } else {
      route.push("/fill-goal-details");
    }
  };

  const changeStatus = async (trackerId: number, status: string) => {
    await changeStatusService(trackerId, status);

    fetchProjects();
  };

  const getColorClass = (rating: string) => {
    switch (rating) {
      case "GREEN":
        return "bg-green-500";
      case "YELLOW":
        return "bg-yellow-500";
      case "RED":
        return "bg-red-500";
      default:
        return ""; // Default if the rating doesn't match
    }
  };

  return (
    <>
      <Layout>
        <SidebarLayout>
          <div className="p-8">
            <div className="rounded-xl shadow-lg overflow-hidden h-[88vh]">
              <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-600 mb-6">
                  Project Dashboard
                </h1>

                {Isloading ? (
                  <Skeleton />
                ) : (
                  <>
                    <div className="flex flex-wrap justify-between">
                      <div className="flex flex-wrap justify-start gap-3">
                        <SelectProject
                          projects={projects}
                          setSelectedProject={setSelectedProject}
                          selectedProject={selectedProject}
                        />
                        <SelectTemplate setTemplate={setTemplate} />
                        <Button
                          variant="outline"
                          // className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
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
                    <div className="overflow-x-auto ">
                      <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg overflow-y-auto max-h-[66vh]">
                          <Table className="min-w-full  ">
                            <TableHeading />
                            <TableBody>
                              {(isFiltered ? filteredProjects : projects).map(
                                (project) => {
                                  // If no goalTrackers, display a single row with placeholders
                                  if (project.goalTrackers.length === 0) {
                                    return (
                                      <TableRow
                                        key={project.projectId}
                                        // className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                      >
                                        <TableCell className="table-cell">
                                          <div className="flex items-center">
                                            <div className="ml-4 font-medium text-sm">
                                              <div>{project?.projectName}</div>
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                        <TableCell>-</TableCell>
                                      </TableRow>
                                    );
                                  }

                                  // Map over goalTrackers if they exist
                                  return project.goalTrackers.map(
                                    (tracker, index) => (
                                      <TableRow
                                        key={tracker.trackerId}
                                        // className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                      >
                                        {/* Display projectName only in the first row of each project's goal trackers */}
                                        <TableCell className="table-cell">
                                          {index === 0 && (
                                            <div className="flex items-center">
                                              <div className="ml-4">
                                                <div className="font-medium text-sm flex items-center gap-2">
                                                  <div
                                                    className={`w-3 h-3 rounded-full ${getColorClass(
                                                      tracker?.rating ?? ""
                                                    )}`}
                                                  ></div>
                                                  {project?.projectName}
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </TableCell>
                                        <TableCell className="table-cell">
                                          <div className=" flex items-center gap-2 text-sm font-medium">
                                            {tracker.goalTrackerName || "-"}
                                            {(tracker?.status === "INITIATED" ||
                                              tracker?.status ===
                                                "IN_PROGRESS" ||
                                              tracker?.status ===
                                                "IN_REVIEW") && (
                                              <TooltipProvider>
                                                <Tooltip>
                                                  <TooltipTrigger>
                                                    <div>
                                                      <ExternalLink
                                                        className="text-blue-500 w-4 h-4 cursor-pointer"
                                                        onClick={() =>
                                                          handleRedirect(
                                                            tracker?.status ??
                                                              "",
                                                            tracker?.trackerId
                                                          )
                                                        }
                                                      />
                                                    </div>
                                                  </TooltipTrigger>
                                                  <TooltipContent>
                                                    <p>Fill tracker details</p>
                                                  </TooltipContent>
                                                </Tooltip>
                                              </TooltipProvider>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell>
                                          <div>
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
                                        </TableCell>
                                        <TableCell>
                                          <span>
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
                                        </TableCell>
                                        <TableCell>
                                          <div>
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
                                        </TableCell>
                                        <TableCell>
                                          <div>
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
                                        </TableCell>
                                        {tracker?.status === "IN_PROGRESS" && (
                                          <TableCell className="table-cell">
                                            <DropdownMenu>
                                              <DropdownMenuTrigger>
                                                <EllipsisVertical className=" h-5 w-5 outline-none" />
                                              </DropdownMenuTrigger>
                                              <DropdownMenuContent>
                                                <DropdownMenuItem
                                                  onClick={() =>
                                                    changeStatus(
                                                      tracker?.trackerId,
                                                      "IN_REVIEW"
                                                    )
                                                  }
                                                >
                                                  Change status to In review
                                                </DropdownMenuItem>
                                              </DropdownMenuContent>
                                            </DropdownMenu>
                                          </TableCell>
                                        )}
                                      </TableRow>
                                    )
                                  );
                                }
                              )}
                            </TableBody>
                          </Table>
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
