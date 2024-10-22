/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

import SidebarLayout from "@/app/sidebar-layout";
import Layout from "@/components/Layout/Layout";
import { getProjectsForQN } from "@/services/projectsServiceQN";
import Skeleton from "@/components/LoadingSkeleton/Skeleton";
import dynamic from "next/dynamic";
import TableHeading from "@/components/Projects/Static/TableHeading";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { changeStatusService } from "@/services/changeStatusService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  setTrackerId,
  setTrackerStatus,
} from "@/redux/slices/trackerDetailsSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter } from "next/navigation";
import SelectProject from "@/components/Projects/CreateGoalDialog/SelectProject";
import SelectTemplate from "@/components/Projects/CreateGoalDialog/SelectTemplate";
import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import StatusCell from "@/components/Projects/StatusCell";

type GoalTracker = {
  trackerId: number;
  goalTrackerName: string;
  startDate: string;
  endDate: string;
  status: string;
  rating: string | null;
  actions: string | null;
  dmNotes: string;
  latest: string;
};

type Project = {
  projectId: number;
  projectName: string;
  templateType: string;
  projectRating: string;
  goalTrackers: GoalTracker[];
};

const ProfessionalDashboard = ({ params }: { params: { id: number } }) => {
  const [Isloading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [isFiltered, setIsFiltered] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [template, setTemplate] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const route = useRouter();

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
      const response: Project[] = await getProjectsForQN(params?.id);

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

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 8;

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

  // const changeStatus = async (trackerId: number, status: string) => {
  //   await changeStatusService(trackerId, status);

  //   fetchProjects();
  // };

  const handleRedirect = (status: string, id: number) => {
    dispatch(setTrackerId(id));
    dispatch(setTrackerStatus(status));

    route.push("/qn/view-goal-details");
  };

  return (
    <>
      <Layout>
        <SidebarLayout>
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 space-y-4">
                <h1 className="text-2xl font-bold text-blue-600 mb-6">
                  Project Dashboard
                </h1>
                {Isloading ? (
                  <Skeleton />
                ) : (
                  <>
                    <div className="flex flex-wrap justify-start gap-3">
                      <SelectProject
                        projects={projects}
                        setSelectedProject={setSelectedProject}
                        selectedProject={selectedProject}
                      />
                      <SelectTemplate setTemplate={setTemplate} />
                      <Button variant="outline">At risk</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg overflow-y-auto max-h-[66vh]">
                          <table className="min-w-full ">
                            <TableHeading />
                            <TableBody>
                              {(isFiltered ? filteredProjects : projects).map(
                                (project) => {
                                  // If no goalTrackers, display a single row with placeholders
                                  if (project.goalTrackers.length === 0) {
                                    return (
                                      <TableRow
                                        key={project.projectId}
                                        className="hover:bg-blue-50 transition-colors duration-150 ease-in-out"
                                      >
                                        <TableCell className="table-cell">
                                          <div className="flex items-center">
                                            <div className="ml-4 font-medium text-sm">
                                              {project?.projectName}
                                            </div>
                                          </div>
                                        </TableCell>
                                        <TableCell className="table-cell  ">
                                          -
                                        </TableCell>
                                        <TableCell className="table-cell  ">
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
                                        <TableCell className="table-cell  ">
                                          -
                                        </TableCell>
                                        <TableCell className="table-cell  ">
                                          -
                                        </TableCell>
                                        <TableCell className="table-cell  ">
                                          -
                                        </TableCell>
                                      </TableRow>
                                    );
                                  }

                                  // Map over goalTrackers if they exist
                                  return project.goalTrackers.map(
                                    (tracker, index) =>
                                      tracker?.status !== "DRAFT" && (
                                        <TableRow
                                          key={tracker.trackerId}
                                          className={`${
                                            tracker?.latest
                                              ? "bg-green-100"
                                              : ""
                                          }`}
                                        >
                                          <TableCell className="table-cell">
                                            {index === 0 && (
                                              <div className="flex items-center">
                                                <div className="ml-4">
                                                  <div className="font-medium text-sm flex items-center gap-2">
                                                    <div
                                                      className={`w-3 h-3 rounded-full ${getColorClass(
                                                        project?.projectRating ??
                                                          ""
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
                                              <div
                                                className={`w-3 h-3 rounded-full ${getColorClass(
                                                  tracker?.rating ?? ""
                                                )}`}
                                              ></div>

                                              {tracker.goalTrackerName || "-"}

                                              {tracker?.status !== "DRAFT" && (
                                                <TooltipProvider>
                                                  <Tooltip>
                                                    <TooltipTrigger>
                                                      <div>
                                                        <Eye
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
                                                      <p>View filled deatils</p>
                                                    </TooltipContent>
                                                  </Tooltip>
                                                </TooltipProvider>
                                              )}
                                            </div>
                                          </TableCell>

                                          <TableCell>
                                            <div className="text-sm">
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
                                                      project.templateType ||
                                                      "-"
                                                    ); // Fallback if no match
                                                }
                                              })()}
                                            </div>
                                          </TableCell>
                                          {/* <TableCell>
                                            <span className="text-sm">
                                              {(() => {
                                                switch (tracker.status) {
                                                  case "DRAFT":
                                                    return "In Draft";
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
                                          </TableCell> */}
                                          <StatusCell status={tracker.status} />
                                          <TableCell>
                                            <div className="text-sm">
                                              {tracker.startDate
                                                ? new Date(
                                                    tracker.startDate
                                                  ).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                    }
                                                  )
                                                : "-"}
                                            </div>
                                          </TableCell>
                                          <TableCell>
                                            <div className="text-sm">
                                              {tracker.endDate
                                                ? new Date(
                                                    tracker.endDate
                                                  ).toLocaleDateString(
                                                    "en-GB",
                                                    {
                                                      day: "2-digit",
                                                      month: "short",
                                                      year: "numeric",
                                                    }
                                                  )
                                                : "-"}
                                            </div>
                                          </TableCell>
                                          {tracker?.dmNotes ? (
                                            <TableCell className="w-48 text-sm">
                                              {tracker?.dmNotes}
                                            </TableCell>
                                          ) : (
                                            <TableCell>-</TableCell>
                                          )}
                                        </TableRow>
                                      )
                                  );
                                }
                              )}
                            </TableBody>
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
