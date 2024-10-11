"use client";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Project = {
  projectId: number;
  projectName: string;
  templateType: string;
};

type SelectProjectProps = {
  projects: Project[];
  selectedProject: { id: number; name: string } | null;
  setSelectedProject: (project: { id: number; name: string }) => void;
};

const SelectProject = ({
  projects,
  selectedProject,
  setSelectedProject,
}: SelectProjectProps) => {
  return (
    <Select
      onValueChange={(projectId) => {
        const selected = projects.find(
          (project) => project.projectId.toString() === projectId
        );
        if (selected) {
          setSelectedProject({
            id: selected.projectId,
            name: selected.projectName,
          });
        }
      }}
    >
      <SelectTrigger className="w-44 bg-blue-50 border-blue-200 hover:border-blue-300 focus:ring-blue-500">
        <SelectValue placeholder="Select project">
          {selectedProject ? selectedProject.name : "Select project"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {projects.map((project: Project) => (
          <SelectItem
            key={project.projectId}
            value={project.projectId.toString()}
          >
            {project.projectName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectProject;
