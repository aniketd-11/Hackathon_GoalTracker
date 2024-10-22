/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from "react";
import SidebarLayout from "@/app/sidebar-layout";
import Layout from "@/components/Layout/Layout";
import { useAppSelector } from "@/redux/hooks";
import { getActionValues } from "@/services/getActionValuesService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, CheckCircle2, AlertCircle, Eye } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";

import { changeStatusService } from "@/services/changeStatusService";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { changeRatingService } from "@/services/changeRatingService";
import { RootState } from "@/redux/store";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addNoteService } from "@/services/addNoteService";
import { toast } from "react-toastify";

interface ActionValue {
  actionName: string;
  actionCategory: string;
  actionValue: string;
  actionRating: string | null;
  benchmarkValue: string;
  customBenchMarkValue: string | null;
  comparisonOperator: string | null;
  isNotApplicable: boolean;
  isExcluded: boolean;
  attachedDocument: string | null;
  actionPlan: string;
  actionplanETA: Date;
}

interface GoalDetails {
  trackerId: number;
  goalTrackerName: string;
  startDate: string;
  endDate: string;
  status: string;
  rating: string;
  actions: ActionValue[];
  dmNotes: string;
}

const ViewGoalDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [goalDetails, setGoalDetails] = useState<GoalDetails | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState("");
  const [actionPlan, setActionPlan] = useState("");
  const [actionPlanETA, setActionPlanETA] = useState<Date | null>(null);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [note, setNote] = useState("");

  const trackerId = useAppSelector(
    (state: RootState) => state.trackerDetails?.trackerId
  );
  const userRole = useAppSelector(
    (state: RootState) => state.auth.user?.roleName
  );

  // const isAuthenticated = useSelector((state: RootState) => state.auth.user);

  const route = useRouter();

  useEffect(() => {
    fetchActionValues();
  }, []);

  async function fetchActionValues() {
    try {
      const response = await getActionValues(trackerId);
      if (response) {
        setGoalDetails(response);
        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log("Error fetching form details:", error);
      setIsLoading(false);
    }
  }

  const getRatingColor = (rating: string | null) => {
    switch (rating) {
      case "GREEN":
        return "bg-green-100 text-green-800";
      case "YELLOW":
        return "bg-yellow-100 text-yellow-800 py-2";
      case "ORANGE":
        return "bg-orange-100 text-orange-800";
      case "RED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingIcon = (rating: string | null) => {
    switch (rating) {
      case "GREEN":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "YELLOW":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "ORANGE":
        return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case "RED":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getOperatorSymbol = (operator: string | null): string => {
    switch (operator) {
      case "GREATER_THAN_EQUAL":
        return "≥";
      case "LESS_THAN_EQUAL":
        return "≤";
      case "EQUAL":
        return "=";
      case "GREATER_THAN":
        return ">";
      case "LESS_THAN":
        return "<";
      default:
        return "";
    }
  };

  const getCategoryDotColor = (actionCategory: string) => {
    switch (actionCategory) {
      case "MAJOR":
        return "bg-red-500"; // Red for MAJOR
      case "MINOR":
        return "bg-orange-500"; // Orange for MINOR
      default:
        return "bg-gray-500"; // Default color
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <SidebarLayout>
          <div className="p-6 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </SidebarLayout>
      </Layout>
    );
  }

  const handleViewAttachedDocument = (
    plan: string,
    eta: Date | null,
    document?: string | null // Move the optional parameter to the end
  ) => {
    // Check if document is provided
    if (document) {
      // Create a Blob from the Base64 string
      const byteCharacters = atob(document);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "image/png" });
      const blobUrl = URL.createObjectURL(blob);

      setCurrentImage(blobUrl);
    } else {
      setCurrentImage(null);
    }

    // Set action plan and ETA regardless of document existence
    setActionPlan(plan);
    setActionPlanETA(eta);
    setShowImageDialog(true);
  };

  const handleStatusChange = async (trackerId: number, status: string) => {
    const response = await changeStatusService(trackerId, status);
    // route.push("/dashboard/accounts");
    if (response?.status == 200) {
      fetchActionValues();
      toast.success("Status changed successfully");
    } else {
      toast.error("Error while changing status");
    }
  };

  const handleChangeRating = async () => {
    await changeRatingService(trackerId, selectedRating);
    route.push("/dashboard/accounts");
  };

  const addNote = async () => {
    const response = await addNoteService(trackerId, userRole, note);
    if (response?.status == 200) {
      toast.success("Note added successfully.");
    } else {
      toast.error("Error adding note");
    }

    setIsNoteOpen(false);
    fetchActionValues();
  };

  return (
    <Layout>
      <SidebarLayout>
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Goal Details</CardTitle>
              <div className="flex gap-2 items-center">
                <Badge className={getRatingColor(goalDetails?.rating || "")}>
                  {goalDetails?.rating}
                </Badge>

                {goalDetails?.status !== "IN_CLOSURE" && (
                  <>
                    <Select onValueChange={(value) => setSelectedRating(value)}>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            goalDetails?.rating
                              ? `Current rating: ${goalDetails.rating}`
                              : "Change rating"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {["GREEN", "YELLOW", "RED"]
                          .filter((rating) => rating !== goalDetails?.rating) // Filter out the current rating
                          .map((rating) => (
                            <SelectItem key={rating} value={rating}>
                              {rating}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>

                    {selectedRating &&
                      selectedRating !== goalDetails?.rating && (
                        <Button onClick={handleChangeRating} className="w-fit">
                          Submit Rating
                        </Button>
                      )}
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <h3 className="font-semibold">
                    {goalDetails?.goalTrackerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tracker ID: {goalDetails?.trackerId}
                  </p>
                  <span className="text-sm text-gray-500">
                    Status :
                    {(() => {
                      switch (goalDetails?.status) {
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
                  {goalDetails?.dmNotes && (
                    <span className="text-sm text-gray-500">
                      DM notes: {goalDetails?.dmNotes || ""}
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500 justify-between">
                  <span className="flex gap-2 items-center">
                    <CalendarDays className="w-4 h-4" />
                    {new Date(
                      goalDetails?.startDate || ""
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(goalDetails?.endDate || "").toLocaleDateString()}
                  </span>

                  <div className="flex flex-col gap-2 items-end">
                    {goalDetails?.status === "INITIATED" && (
                      <Button
                        onClick={() =>
                          handleStatusChange(
                            goalDetails?.trackerId ?? 0,
                            "IN_REVIEW"
                          )
                        }
                        className="w-fit"
                      >
                        Start review
                      </Button>
                    )}

                    {goalDetails?.status === "IN_REVIEW" && (
                      <Button
                        onClick={() =>
                          handleStatusChange(
                            goalDetails?.trackerId ?? 0,
                            "IN_PROGRESS"
                          )
                        }
                        className="w-fit"
                      >
                        Change Status to In Progress
                      </Button>
                    )}

                    {goalDetails?.status === "IN_CLOSURE" && (
                      <Button
                        onClick={() =>
                          handleStatusChange(
                            goalDetails?.trackerId ?? 0,
                            "CLOSED"
                          )
                        }
                        className="w-fit"
                      >
                        Change Status to Closed
                      </Button>
                    )}
                    {goalDetails?.status !== "IN_CLOSURE" && (
                      <Button
                        onClick={() => setIsNoteOpen(true)}
                        className="w-fit"
                      >
                        Add QN notes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row justify-between flex-wrap">
              <CardTitle className="text-xl font-semibold">
                Action Values
              </CardTitle>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div>
                  <span className="text-sm text-gray-500">Major NC</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 rounded-full bg-orange-500 mr-1"></div>
                  <span className="text-sm text-gray-500">Minor NC</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500">
                    ** Custom Benchmark Value
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Action Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Benchmark</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {goalDetails?.actions.map((action, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${getCategoryDotColor(
                              action.actionCategory
                            )}`}
                          ></div>
                          {action.actionName}
                        </div>
                      </TableCell>
                      <TableCell>
                        {action.isExcluded ? (
                          <span className="flex items-center gap-2">
                            Marked as Excluded
                            {action?.attachedDocument && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Eye
                                      className="w-4 h-4 mr-2"
                                      onClick={() =>
                                        handleViewAttachedDocument(
                                          action?.actionPlan,
                                          action?.actionplanETA,
                                          action?.attachedDocument
                                        )
                                      }
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        ) : action.isNotApplicable ? (
                          <span className="flex items-center gap-2">
                            Marked as NA
                            {action?.attachedDocument && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Eye
                                      className="w-4 h-4 mr-2"
                                      onClick={() =>
                                        handleViewAttachedDocument(
                                          action?.actionPlan,
                                          action?.actionplanETA,
                                          action?.attachedDocument
                                        )
                                      }
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        ) : action?.actionPlan ? (
                          <span className="flex items-center gap-2">
                            {action?.actionValue}
                            {action?.actionPlan && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <Eye
                                      className="w-4 h-4 mr-2"
                                      onClick={() =>
                                        handleViewAttachedDocument(
                                          action?.actionPlan,
                                          action?.actionplanETA,
                                          undefined
                                        )
                                      }
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>View document</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </span>
                        ) : (
                          action.actionValue || ""
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">
                            {getOperatorSymbol(action.comparisonOperator)}
                          </span>
                          <span>
                            {action.customBenchMarkValue &&
                            action.customBenchMarkValue.trim() !== ""
                              ? `${action.customBenchMarkValue} **`
                              : action.benchmarkValue}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {action.actionRating !== null &&
                            getRatingIcon(action.actionRating)}
                          {action.actionRating !== null ? (
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${getRatingColor(
                                action.actionRating
                              )}`}
                            >
                              {action.actionRating}
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold text-gray-500">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </SidebarLayout>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attached Document</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="relative w-full h-[60vh]">
              <img
                src={currentImage}
                alt="Attached Document"
                className="w-full h-full object-contain cursor-pointer "
                onClick={() => window.open(currentImage, "_blank")}
              />
            </div>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="actionPlan">Added Action Plan</Label>
              <Textarea
                id="actionPlan"
                name="actionPlan"
                placeholder="Enter your action plan here"
                defaultValue={actionPlan}
              />
            </div>

            <div>
              <label htmlFor="eta">Added ETA </label>
              <input
                type="date"
                id="eta"
                name="eta"
                defaultValue={
                  actionPlanETA
                    ? new Date(actionPlanETA).toISOString().split("T")[0] // Convert Date to string in YYYY-MM-DD format
                    : ""
                }
                className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowImageDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add QN notes</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Textarea
                id="actionPlan"
                name="actionPlan"
                placeholder="Enter your action plan here"
                onChange={(e) => {
                  setNote(e.target.value);
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={addNote}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ViewGoalDetails), { ssr: false });
