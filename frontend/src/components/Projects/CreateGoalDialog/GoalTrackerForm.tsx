"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation"; // For redirection after form submission
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { DatePicker } from "./DatePicker";
import SelectTemplate from "./SelectTemplate";
import SelectProject from "./SelectProject";
import { createGoalTracker } from "@/services/createGoalTracker";
import { useAppDispatch } from "@/redux/hooks";
import { setTrackerId } from "@/redux/slices/trackerDetailsSlice";

type Project = {
  projectId: number;
  projectName: string;
  templateType: string;
};

type GoalTrackerFormProps = {
  projects: Project[]; // This indicates that 'projects' is an array of Project objects
  fetchProjects: () => void; // Assuming this is a function passed as a prop
};

export function GoalTrackerForm({
  projects,
  fetchProjects,
}: GoalTrackerFormProps) {
  const [goalTrackerName, setGoalTrackerName] = useState("");
  const [trackerType, setTrackerType] = useState("");
  const [selectedProject, setSelectedProject] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const [template, setTemplate] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null); // Initialize with null
  const [endDate, setEndDate] = useState<Date | null>(null); // Initialize with null

  const [openPicker, setOpenPicker] = useState(""); // "start" or "end"
  const router = useRouter(); // For redirection

  const dispatch = useAppDispatch();

  // Form validation
  const validateForm = () => {
    return (
      goalTrackerName &&
      trackerType &&
      selectedProject &&
      template &&
      startDate &&
      endDate
    );
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      alert("Please fill all fields");
      return;
    }

    const response = await createGoalTracker({
      goalTrackerName,
      type: trackerType,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      projectId: selectedProject?.id,
    });

    console.log(response);
    if (response?.trackerId) {
      router.push("/fill-goal-details"); // Replace "/success" with the actual route
      dispatch(setTrackerId(response?.trackerId));
      fetchProjects();
    }

    // console.log("Form Data: ", data); // You can replace this with an API call to save the data

    // Redirect after submission
  };

  const handleOpenPicker = (picker: string) => {
    // If the same picker is clicked, close it; otherwise, open the new one
    setOpenPicker(openPicker === picker ? "" : picker);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-600 text-white border-blue-200 hover:bg-blue-900 hover:text-white"
        >
          Create a new goal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-base text-blue-800">
              Create a new goal
            </DialogTitle>
            <DialogDescription>
              Enter the details below and make sure all fields are accurate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-2">
              <SelectProject
                projects={projects}
                setSelectedProject={setSelectedProject}
                selectedProject={selectedProject}
              />

              <SelectTemplate setTemplate={setTemplate} />
            </div>

            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="trackerName">Tracker name</Label>
              <Input
                id="trackerName"
                placeholder="Sprint 4 for zimbve"
                value={goalTrackerName}
                onChange={(e) => setGoalTrackerName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="trackerType">Tracker type</Label>
              <Input
                id="trackerType"
                placeholder="Sprint/Milestone"
                value={trackerType}
                onChange={(e) => setTrackerType(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <DatePicker
                label="Start date"
                selectedDate={startDate}
                onDateChange={(date: Date) => {
                  setStartDate(date);
                  setOpenPicker(""); // Close the picker after selection
                }}
                isOpen={openPicker === "start"}
                onOpen={() => handleOpenPicker("start")}
              />
              <DatePicker
                label="End date"
                selectedDate={endDate}
                onDateChange={(date: Date) => {
                  setEndDate(date);
                  setOpenPicker(""); // Close the picker after selection
                }}
                isOpen={openPicker === "end"}
                onOpen={() => handleOpenPicker("end")}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit">Create goal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
