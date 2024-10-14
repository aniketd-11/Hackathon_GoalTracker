"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  FieldValues,
  Controller,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronLeft, Target, Eye } from "lucide-react";
import { getFormDetails } from "@/services/formDetailsService";
import { Stepper } from "@/components/ui/stepper";
import Layout from "@/components/Layout/Layout";
import SidebarLayout from "@/app/sidebar-layout";
import Skeleton from "@/components/LoadingSkeleton/Skeleton";
import { useAppSelector } from "@/redux/hooks";
import { submitTrackingDetails } from "@/services/submitTrackingDetailsSlice";
import { getActionValues } from "@/services/getActionValuesService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

import dynamic from "next/dynamic";

interface FormField {
  actionId: number;
  templateTypes: string;
  actionName: string;
  actionType: string;
  benchmarkValue: string;
  comparisonOperator: string | null;
  additionalInfo: string | null;
  actionOptions: string | null;
  actionCategory: string;
  createdAt: string;
  actionValue?: string | number;
  isNotApplicable?: boolean;
  attachedDocument?: string | null;
}

const GoalDetailsForm = () => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      steps: [{}, {}, {}],
    },
  });
  const { fields } = useFieldArray({
    control,
    name: "steps",
  });

  const trackerId = useAppSelector(
    (state: any) => state.trackerDetails?.trackerId
  );
  const trackerStatus = useAppSelector(
    (state: any) => state.trackerDetails?.status
  );

  useEffect(() => {
    if (trackerStatus === "IN_PROGRESS") {
      fetchActionValues();
    } else {
      fetchFormDetails();
    }
  }, []);

  async function fetchFormDetails() {
    try {
      const response = await getFormDetails("T_M");
      if (Array.isArray(response)) {
        setFormData(response);
        initializeFormState(response);
        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log("Error fetching form details:", error);
    }
  }

  async function fetchActionValues() {
    try {
      const response = await getActionValues(trackerId);
      if (response && response.actions) {
        setFormData(response.actions);
        initializeFormState(response.actions);
        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log("Error fetching form details:", error);
    }
  }

  const initializeFormState = (data: FormField[]) => {
    const stepsData = [data.slice(0, 4), data.slice(4, 8), data.slice(8)];

    stepsData.forEach((stepFields, stepIndex) => {
      stepFields.forEach((field) => {
        setValue(`steps.${stepIndex}.${field.actionId}`, {
          value: field.actionValue || "",
          isNotApplicable: field.isNotApplicable || false,
          attachedDocument: field.attachedDocument || null,
        });
      });
    });
  };

  const onSubmit = async (data: FieldValues) => {
    const formattedGoals: Array<{
      actionId: number;
      actionValue: string;
      isNotApplicable: boolean;
    }> = [];

    const fileUploads: { [key: string]: File } = {};
    data.steps.forEach((step: number) => {
      Object.entries(step).forEach(([actionId, fieldData]: [string, any]) => {
        const actionValue =
          fieldData.value !== undefined ? fieldData.value : ""; // Use actionValue if provided
        const isNotApplicable = fieldData.isNotApplicable || actionValue === ""; // NA if user marked or actionValue is ""

        // Create the goal object
        const goal = {
          actionId: parseInt(actionId, 10),
          actionValue,
          isNotApplicable,
        };

        // Push the goal to formattedGoals if there's an actionValue or if isNotApplicable is true
        if (actionValue !== "" || isNotApplicable) {
          formattedGoals.push(goal);
        }

        // Handle attachedDocument and store in fileUploads separately
        if (fieldData.attachedDocument) {
          fileUploads[`file-${actionId}`] = fieldData.attachedDocument;
        }
      });
    });

    // Uncomment the following lines when ready to submit
    const response = await submitTrackingDetails({
      formattedGoals,
      trackerId,
      fileUploads, // Pass fileUploads here
    });

    if (response?.status === 200) {
      route.push("/dashboard/projects");
    }
  };

  const steps = [
    { title: "1", fields: formData.slice(0, 4) },
    { title: "2", fields: formData.slice(4, 8) },
    { title: "3", fields: formData.slice(8) },
  ];

  const handleNAToggle = (
    stepIndex: number,
    actionId: number,
    isChecked: boolean
  ) => {
    setValue(`steps.${stepIndex}.${actionId}.isNotApplicable`, isChecked);
    if (isChecked) {
      setCurrentActionId(`${stepIndex}.${actionId}`);
      setOpenDialog(true);
    } else {
      setValue(`steps.${stepIndex}.${actionId}.attachedDocument`, null);
    }
  };

  const handleProofUpload = (file: File) => {
    if (currentActionId !== null) {
      const [stepIndex, actionId] = currentActionId.split(".");
      setValue(`steps.${stepIndex}.${actionId}.attachedDocument`, file.name);
      setOpenDialog(false);
    }
  };

  const handleViewAttachedDocument = (document: string) => {
    setCurrentImage(`/api/images/${encodeURIComponent(document)}`);
    setShowImageDialog(true);
  };

  const renderField = (field: FormField, stepIndex: number) => {
    const fieldId = `steps.${stepIndex}.${field.actionId}`;
    const isNA = watch(`${fieldId}.isNotApplicable`);
    const attachedDocument = watch(`${fieldId}.attachedDocument`);

    return (
      <div key={field.actionId} className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center space-x-4">
            <Label
              htmlFor={`action-${field.actionId}`}
              className="text-sm font-medium"
            >
              {field.actionName}
            </Label>
            <div className="flex items-center space-x-2">
              <Label
                htmlFor={`na-toggle-${fieldId}`}
                className="text-sm font-medium text-gray-500"
              >
                Mark as NA
              </Label>
              <Switch
                id={`na-toggle-${fieldId}`}
                checked={isNA}
                onCheckedChange={(checked) =>
                  handleNAToggle(stepIndex, field.actionId, checked)
                }
              />
              {attachedDocument && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Eye
                        className="w-4 h-4 mr-2"
                        onClick={() =>
                          handleViewAttachedDocument(attachedDocument)
                        }
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View document</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <Target size={14} />
                    <span className="text-xs font-semibold">
                      {getOperatorSymbol(field.comparisonOperator)}{" "}
                      {field.benchmarkValue}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Benchmark Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Badge
              variant={
                field.actionCategory === "MAJOR" ? "destructive" : "secondary"
              }
            >
              {field.actionCategory}
            </Badge>
          </div>
        </div>
        {!isNA && (
          <Controller
            name={`${fieldId}.value`}
            control={control}
            defaultValue={field?.actionValue || ""}
            render={({ field: { onChange, value } }) => {
              switch (field.actionType) {
                case "OPTION":
                  return (
                    <Select onValueChange={onChange} value={value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an option" />
                      </SelectTrigger>
                      <SelectContent>
                        {field.actionOptions?.split(",").map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                case "PERCENTAGE":
                  return (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        onChange={onChange}
                        value={value}
                        placeholder="Enter percentage"
                      />
                      <span>%</span>
                    </div>
                  );
                case "NUMERIC":
                  return (
                    <Input
                      type="number"
                      onChange={onChange}
                      value={value}
                      placeholder="Enter number"
                    />
                  );
                default:
                  return (
                    <Input
                      type="text"
                      onChange={onChange}
                      value={value}
                      placeholder="Enter value"
                    />
                  );
              }
            }}
          />
        )}
        {errors.steps?.[stepIndex]?.[field.actionId] && (
          <p className="text-red-500 text-xs mt-1">This field is required</p>
        )}
      </div>
    );
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

  return (
    <Layout>
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-4xl mx-auto">
            {isLoading ? (
              <Skeleton />
            ) : (
              <>
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-center">
                    Goal Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Stepper
                    steps={steps.map((step) => step.title)}
                    currentStep={currentStep}
                    className="mb-8"
                  />
                  <form onSubmit={handleSubmit(onSubmit)}>
                    {steps[currentStep].fields.map((field) =>
                      renderField(field, currentStep)
                    )}
                  </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentStep((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentStep === 0}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  {currentStep < steps.length - 1 ? (
                    <Button
                      onClick={() =>
                        setCurrentStep((prev) =>
                          Math.min(steps.length - 1, prev + 1)
                        )
                      }
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit" onClick={handleSubmit(onSubmit)}>
                      Submit
                    </Button>
                  )}
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </SidebarLayout>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Proof for NA</DialogTitle>
          </DialogHeader>
          <Input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                handleProofUpload(file);
              }
            }}
            accept=".png,.jpg"
          />
          <DialogFooter>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
                className="w-full h-full object-contain"
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

export default dynamic(() => Promise.resolve(GoalDetailsForm), {
  ssr: false,
});
