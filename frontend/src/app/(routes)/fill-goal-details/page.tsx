"use client";

import React, { useState, useEffect } from "react";
import {
  useForm,
  useFieldArray,
  FieldValues,
  Controller,
} from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronRight, ChevronLeft, Target, Eye, Edit } from "lucide-react";
import { getFormDetails } from "@/services/formDetailsService";
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
import { RootState } from "@/redux/store";

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
  isExcluded?: boolean;
  attachedDocument?: string | null;
  customBenchmarkValue?: string | null;
}

const GoalDetailsForm = () => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState("1");
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

  useFieldArray({
    control,
    name: "steps",
  });

  const trackerId = useAppSelector(
    (state: RootState) => state.trackerDetails?.trackerId
  );
  const trackerStatus = useAppSelector(
    (state: RootState) => state.trackerDetails?.status
  );

  useEffect(() => {
    if (trackerStatus === "IN_PROGRESS") {
      fetchActionValues();
    } else {
      fetchFormDetails();
    }
  }, [trackerStatus]);

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
        const key = `steps.${stepIndex}.${field.actionId}`;
        setValue(key as any, {
          value: field.actionValue || "",
          isNotApplicable: field.isNotApplicable || false,
          isExcluded: field.isExcluded || false,
          attachedDocument: field.attachedDocument || null,
          customBenchmarkValue: field.customBenchmarkValue || null,
        });
      });
    });
  };

  const onSubmit = async (data: FieldValues) => {
    const formattedGoals: Array<{
      actionId: number;
      actionValue: string;
      isNotApplicable: boolean;
      isExcluded: boolean;
      customBenchmarkValue: string | null;
    }> = [];

    const fileUploads: { [key: string]: File } = {};
    data.steps.forEach((step: any) => {
      Object.entries(step).forEach(([actionId, fieldData]: [string, any]) => {
        const actionValue =
          fieldData.value !== undefined ? fieldData.value : "";
        const isNotApplicable = fieldData.isNotApplicable || actionValue === "";
        const isExcluded = fieldData.isExcluded || false;
        const customBenchmarkValue = fieldData.customBenchmarkValue || null;

        const goal = {
          actionId: parseInt(actionId, 10),
          actionValue,
          isNotApplicable,
          isExcluded,
          customBenchmarkValue,
        };

        if (actionValue !== "" || isNotApplicable || isExcluded) {
          formattedGoals.push(goal);
        }

        if (fieldData.attachedDocument) {
          fileUploads[`file-${actionId}`] = fieldData.attachedDocument;
        }
      });
    });

    const response = await submitTrackingDetails({
      formattedGoals,
      trackerId,
      fileUploads,
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

  const handleExcludeToggle = (
    stepIndex: number,
    actionId: number,
    isChecked: boolean
  ) => {
    setValue(`steps.${stepIndex}.${actionId}.isExcluded`, isChecked);
  };

  const handleProofUpload = (file: File) => {
    if (currentActionId !== null) {
      const [stepIndex, actionId] = currentActionId.split(".");
      setValue(`steps.${stepIndex}.${actionId}.attachedDocument`, file);
      setOpenDialog(false);
    }
  };

  const handleViewAttachedDocument = (
    event: React.MouseEvent,
    document: string | null
  ) => {
    event.preventDefault();
    if (!document) return;

    const byteCharacters = atob(document);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/png" });
    const blobUrl = URL.createObjectURL(blob);

    setCurrentImage(blobUrl);
    setShowImageDialog(true);
  };

  const renderField = (field: FormField, stepIndex: number) => {
    const fieldId = `steps.${stepIndex}.${field.actionId}`;
    const isNA = watch(`${fieldId}.isNotApplicable`) ?? false;
    const isExcluded = watch(`${fieldId}.isExcluded`) ?? false;
    const attachedDocument = watch(`${fieldId}.attachedDocument`);
    const customBenchmarkValue = watch(`${fieldId}.customBenchmarkValue`);

    return (
      <div key={field.actionId} className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">{field.actionName}</Label>
            <Badge
              variant={
                field.actionCategory === "MAJOR" ? "destructive" : "secondary"
              }
            >
              {field.actionCategory}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            {isNA && <Badge variant="outline">NA</Badge>}
            {isExcluded && <Badge variant="outline">Excluded</Badge>}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Label htmlFor={`na-toggle-${fieldId}`} className="text-sm">
                Mark as NA
              </Label>
              <Switch
                id={`na-toggle-${fieldId}`}
                checked={isNA}
                onCheckedChange={(checked) =>
                  handleNAToggle(stepIndex, field.actionId, checked)
                }
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor={`exclude-toggle-${fieldId}`} className="text-sm">
                Exclude
              </Label>
              <Switch
                id={`exclude-toggle-${fieldId}`}
                checked={isExcluded}
                onCheckedChange={(checked) =>
                  handleExcludeToggle(stepIndex, field.actionId, checked)
                }
              />
            </div>
          </div>

          {!isNA && (
            <Controller
              name={`${fieldId}.value`}
              control={control}
              defaultValue={field?.actionValue || ""}
              render={({ field: { onChange, value } }) => {
                const selectValue = typeof value === "string" ? value : "";
                switch (field.actionType) {
                  case "OPTION":
                    return (
                      <Select onValueChange={onChange} value={selectValue}>
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
                          value={selectValue}
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
                        value={selectValue}
                        placeholder="Enter number"
                      />
                    );
                  default:
                    return (
                      <Input
                        type="text"
                        onChange={onChange}
                        value={selectValue}
                        placeholder="Enter value"
                      />
                    );
                }
              }}
            />
          )}

          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    <Target size={14} />
                    <span className="text-xs font-semibold">
                      {getOperatorSymbol(field.comparisonOperator)}{" "}
                      {customBenchmarkValue || field.benchmarkValue}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Benchmark Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const newValue = prompt(
                  "Enter custom benchmark value",
                  customBenchmarkValue || field.benchmarkValue
                );
                if (newValue !== null) {
                  setValue(`${fieldId}.customBenchmarkValue`, newValue);
                }
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>

          {attachedDocument && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Attached Document:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  if (typeof attachedDocument === "string") {
                    handleViewAttachedDocument(event, attachedDocument);
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </div>
          )}
        </div>
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
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold text-center mb-8">Goal Details</h1>
          {isLoading ? (
            <Skeleton />
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Tabs
                value={currentStep}
                onValueChange={setCurrentStep}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  {steps.map((step) => (
                    <TabsTrigger
                      key={step.title}
                      value={step.title}
                      className="text-sm"
                    >
                      Step {step.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {steps.map((step, index) => (
                  <TabsContent key={step.title} value={step.title}>
                    <div className="space-y-6">
                      {step.fields.map((field) => renderField(field, index))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setCurrentStep(
                      (prev) => `${Math.max(1, parseInt(prev) - 1)}`
                    )
                  }
                  disabled={currentStep === "1"}
                >
                  <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                {currentStep !== "3" ? (
                  <Button
                    type="button"
                    onClick={() =>
                      setCurrentStep(
                        (prev) => `${Math.min(3, parseInt(prev) + 1)}`
                      )
                    }
                  >
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button type="submit">Submit</Button>
                )}
              </div>
            </form>
          )}
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

export default GoalDetailsForm;
