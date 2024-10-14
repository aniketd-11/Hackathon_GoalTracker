"use client";

import React, { useEffect, useState } from "react";
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

interface ActionValue {
  actionName: string;
  actionCategory: string,
  actionValue: string;
  actionRating: string | null;
  benchmarkValue: string;
  comparisonOperator: string | null;
  isNotApplicable: boolean;
  attachedDocument: string | null;
}

interface GoalDetails {
  trackerId: number;
  goalTrackerName: string;
  startDate: string;
  endDate: string;
  status: string;
  rating: string;
  actions: ActionValue[];
}

const ViewGoalDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [goalDetails, setGoalDetails] = useState<GoalDetails | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const trackerId = useAppSelector(
    (state: any) => state.trackerDetails?.trackerId
  );

  useEffect(() => {
    fetchActionValues();
  }, []);

  async function fetchActionValues() {
    try {
      const response = await getActionValues(trackerId);
      if (response) {
        console.log(response);
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
        return "bg-yellow-100 text-yellow-800";
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

  const handleViewAttachedDocument = (document: string | null) => {
    let imageUrl = document?.split("uploads/")[1];
    setCurrentImage(`https://goaltrackerbackend.onrender.com/uploads/${imageUrl}`);
    setShowImageDialog(true);
  };

  return (
    <Layout>
      <SidebarLayout>
        <div className="p-6 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-2xl font-bold">Goal Details</CardTitle>
              <Badge className={getRatingColor(goalDetails?.rating || "")}>
                {goalDetails?.rating}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold">
                    {goalDetails?.goalTrackerName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Tracker ID: {goalDetails?.trackerId}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <CalendarDays className="w-4 h-4" />
                  <span>
                    {new Date(
                      goalDetails?.startDate || ""
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(goalDetails?.endDate || "").toLocaleDateString()}
                  </span>
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
                        {action.actionValue ||
                          (action.isNotApplicable ? (
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
                          ) : (
                            ""
                          ))}
                      </TableCell>

                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <span className="text-gray-500">
                            {getOperatorSymbol(action.comparisonOperator)}
                          </span>
                          <span>{action.benchmarkValue}</span>
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
          <DialogFooter>
            <Button onClick={() => setShowImageDialog(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ViewGoalDetails), { ssr: false });
