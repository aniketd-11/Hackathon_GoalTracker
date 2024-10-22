/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
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
import dynamic from "next/dynamic";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";

// import { DatePicker } from "@/components/Projects/CreateGoalDialog/DatePicker";

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
  actionPlan?: string;
  eta?: Date | undefined;
}

// interface FieldData {
//   value?: string;
//   isNotApplicable?: boolean;
//   attachedDocument?: string | null; // Ensure attachedDocument is defined
// }

type Step = {
  isNotApplicable: boolean;
  attachedDocument: File | null;
};

type FormValues = {
  steps: Step[];
};

type FieldError = {
  steps?: Array<{
    [key: string]: FieldError | undefined; // Assuming FieldError is the type for your errors
  }>;
};

const GoalDetailsForm = () => {
  const route = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState("1");
  const [openDialog, setOpenDialog] = useState(false);
  const [currentActionId, setCurrentActionId] = useState<string | null>(null);
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [showCustomizeInput, setShowCustomizeInput] = useState<boolean>(false);
  const [currentFieldId, setCurrentFieldId] = useState("");
  const [isSubmitButtonClicked, setIsSubmitButtonClicked] = useState(false);

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
    if (trackerStatus === "INITIATED") {
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
      toast.error("Error fetching form details.");
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
          actionPlan: field.actionPlan || "",
          eta: field.eta,
        });
      });
    });
  };

  // const onSubmit = async (data: FieldValues) => {
  //   const formattedGoals: Array<{
  //     actionId: number;
  //     actionValue: string;
  //     isNotApplicable: boolean;
  //     isExcluded: boolean;
  //     customBenchmarkValue: string | null;
  //   }> = [];

  //   const fileUploads: { [key: string]: File } = {};
  //   data.steps.forEach((step: any) => {
  //     Object.entries(step).forEach(([actionId, fieldData]: [string, any]) => {
  //       const actionValue =
  //         fieldData.value !== undefined ? fieldData.value : "";
  //       const isNotApplicable = fieldData.isNotApplicable || actionValue === "";
  //       const isExcluded = fieldData.isExcluded || false;
  //       const customBenchmarkValue = fieldData.customBenchmarkValue || null;

  //       const goal = {
  //         actionId: parseInt(actionId, 10),
  //         actionValue,
  //         isNotApplicable,
  //         isExcluded,
  //         customBenchmarkValue,
  //       };

  //       if (actionValue !== "" || isNotApplicable || isExcluded) {
  //         formattedGoals.push(goal);
  //       }

  //       if (fieldData.attachedDocument) {
  //         fileUploads[`file-${actionId}`] = fieldData.attachedDocument;
  //       }
  //     });
  //   });

  //   console.log(formattedGoals);
  //   console.log(fileUploads);

  //   // const response = await submitTrackingDetails({
  //   //   formattedGoals,
  //   //   trackerId,
  //   //   fileUploads,
  //   // });

  //   // if (response?.status === 200) {
  //   //   route.push("/dashboard/projects");
  //   // }
  // };

  const onSubmit = async (data: FieldValues) => {
    setIsSubmitButtonClicked(true);

    toast.success(
      "Form submitted. Calculating rating for actions Please wait "
    );

    const formattedGoals: Array<{
      actionId: number;
      actionValue: string;
      isNotApplicable: boolean;
      isExcluded: boolean;
      customBenchmarkValue: string | number | null;
      actionPlan?: string;
      actionPlanETA?: Date | undefined | null;
      additionalInfoValue: null;
    }> = [];

    const fileUploads: { [key: string]: File } = {};

    data.steps.forEach((step: any) => {
      Object.entries(step).forEach(([actionId, fieldData]: [string, any]) => {
        const actionValue =
          fieldData.value !== undefined ? fieldData.value : "";
        const isNotApplicable = fieldData.isNotApplicable || actionValue === "";
        const isExcluded = fieldData.isExcluded || false;
        const customBenchmarkValue = fieldData.customBenchmarkValue || null;
        const actionPlan = fieldData.actionPlan;
        const actionPlanETA = fieldData.actionPlanETA || "";

        const goal = {
          actionId: parseInt(actionId, 10),
          actionValue,
          isNotApplicable,
          isExcluded,
          customBenchmarkValue,
          actionPlan,
          actionPlanETA,
          additionalInfoValue: null,
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
      setIsSubmitButtonClicked(false);

      route.push("/dm/view-goal-details");
    } else {
      toast.error("Error while calculating rating.");
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
    setValue(
      `steps.${stepIndex}.${actionId}.isNotApplicable` as keyof FormValues,
      isChecked as any
    );
    if (isChecked) {
      setCurrentActionId(`${stepIndex}.${actionId}`);
      setOpenDialog(true);
    } else {
      setValue(
        `steps.${stepIndex}.${actionId}.attachedDocument` as keyof FormValues,
        null as any
      );
      setValue(`steps.${stepIndex}.${actionId}.actionPlan` as any, null);
      setValue(`steps.${stepIndex}.${actionId}.eta` as any, null);
    }
  };

  const handleExcludeToggle = (
    stepIndex: number,
    actionId: number,
    isChecked: boolean
  ) => {
    setValue(`steps.${stepIndex}.${actionId}.isExcluded` as any, isChecked);
    if (isChecked) {
      setCurrentActionId(`${stepIndex}.${actionId}`);
      setOpenDialog(true);
    }
  };

  const handleProofUpload = (
    file: File | null,
    actionPlan: string,
    eta: Date | undefined
  ) => {
    if (currentActionId !== null) {
      const [stepIndex, actionId] = currentActionId.split(".");
      setValue(
        `steps.${stepIndex}.${actionId}.attachedDocument` as keyof FormValues,
        file as any
      );
      setValue(`steps.${stepIndex}.${actionId}.actionPlan` as any, actionPlan);
      setValue(`steps.${stepIndex}.${actionId}.actionPlanETA` as any, eta);
      setOpenDialog(false);
    }
  };

  const handleViewAttachedDocument = (
    event: React.MouseEvent,
    document: string | null,
    fieldId: any
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
    setCurrentFieldId(fieldId);
  };

  const renderField = (field: FormField, stepIndex: number) => {
    const fieldId = `steps.${stepIndex}.${field.actionId}`;
    const isNA =
      watch(`${fieldId}.isNotApplicable` as keyof FormValues) ?? false;
    const isExcluded =
      watch(`${fieldId}.isExcluded` as keyof FormValues) ?? false;
    const attachedDocument = watch(
      `${fieldId}.attachedDocument` as keyof FormValues
    );
    const customBenchmarkValue = watch(
      `${fieldId}.customBenchmarkValue` as keyof FormValues
    );

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
                checked={Boolean(isNA)}
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
                checked={Boolean(isExcluded)}
                onCheckedChange={(checked) =>
                  handleExcludeToggle(stepIndex, field.actionId, checked)
                }
              />
            </div>
          </div>

          {!isNA && (
            <Controller
              name={`${fieldId}.value` as `steps.${number}`} // Ensure you assert correctly
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

          <div className="flex items-center space-x-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full cursor-pointer">
                    <Target size={14} />
                    <span className="text-xs font-semibold">
                      {getOperatorSymbol(field.comparisonOperator)}{" "}
                      {(
                        customBenchmarkValue ||
                        field.benchmarkValue ||
                        ""
                      ).toString()}
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
              onClick={(ev) => {
                ev.preventDefault();
                setShowCustomizeInput(!showCustomizeInput);
              }}
            >
              <Edit className="h-4 w-4" />
            </Button>

            {showCustomizeInput && (
              <div className="flex flex-col items-start gap-2">
                {" "}
                <Label htmlFor="customizeValue">Add customize benchmark</Label>
                <Input
                  id="customizeValue"
                  name="customizeValue"
                  type="text"
                  onChange={(ev) => {
                    setValue(
                      `steps.${stepIndex}.${field.actionId}.customBenchmarkValue` as any,
                      ev.target.value
                    );
                  }}
                />{" "}
              </div>
            )}
          </div>

          {attachedDocument && (
            <div className="flex items-center space-x-2">
              <Label className="text-sm">Attached Document:</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={(event) => {
                  if (typeof attachedDocument === "string") {
                    handleViewAttachedDocument(
                      event,
                      attachedDocument,
                      fieldId
                    );
                  }
                }}
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
            </div>
          )}
        </div>
        {/* // Your existing code */}
        {(
          errors.steps?.[stepIndex] as Record<string, FieldError | undefined>
        )?.[field.actionId] && (
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
        <div className="container mx-auto py-8 flex flex-col min-h-screen">
          <div className="flex-grow flex flex-col">
            <h1 className="text-2xl font-bold text-center mb-8">
              Goal Details
            </h1>
            {isLoading ? (
              <Skeleton />
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col flex-grow"
              >
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
                <div className="flex justify-between mt-auto pt-8">
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
                      onClick={(ev) => {
                        ev.preventDefault(); // Prevent the default form submission
                        setCurrentStep(
                          (prev) => `${Math.min(3, parseInt(prev) + 1)}`
                        ); // Increment step
                      }}
                    >
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button type="submit">
                      {isSubmitButtonClicked ? (
                        <div role="status">
                          <svg
                            aria-hidden="true"
                            className="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-white"
                            viewBox="0 0 100 101"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                              fill="currentColor"
                            />
                            <path
                              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                              fill="currentFill"
                            />
                          </svg>
                        </div>
                      ) : (
                        "Submit"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </SidebarLayout>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {watch(
                `steps.${currentActionId?.split(".")[0]}.${
                  currentActionId?.split(".")[1]
                }.isNotApplicable` as any
              )
                ? "Upload Proof for NA"
                : "Add Details for Exclude"}
            </DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const file = formData.get("file") as File | null;
              const actionPlan = formData.get("actionPlan") as string;
              const etaString = formData.get("eta") as Date | null;

              const eta = etaString ? new Date(etaString) : undefined;

              handleProofUpload(file, actionPlan, eta);
            }}
          >
            <div className="space-y-4">
              <div>
                <Label htmlFor="file">Upload Proof</Label>
                <Input id="file" name="file" type="file" accept=".png,.jpg" />
              </div>
              <div>
                <Label htmlFor="actionPlan">Add Action Plan</Label>
                <Textarea
                  id="actionPlan"
                  name="actionPlan"
                  placeholder="Enter your action plan here"
                />
              </div>
              <div>
                <label htmlFor="eta">Add ETA </label>
                <input
                  type="date"
                  id="eta"
                  name="eta"
                  value={
                    watch(
                      `steps.${currentActionId?.split(".")[0]}.${
                        currentActionId?.split(".")[1]
                      }.eta` as any
                    )
                      ? new Date(
                          watch(
                            `steps.${currentActionId?.split(".")[0]}.${
                              currentActionId?.split(".")[1]
                            }.eta` as any
                          )
                        )
                          .toISOString() // Format to ISO 8601 string
                          .split("T")[0] // Extract the date part (YYYY-MM-DD)
                      : ""
                  }
                  onChange={(e) => {
                    const selectedDate = e.target.value
                      ? new Date(e.target.value)
                      : null;
                    if (selectedDate) {
                      setValue(
                        `steps.${currentActionId?.split(".")[0]}.${
                          currentActionId?.split(".")[1]
                        }.eta` as any,
                        selectedDate // Store the formatted date
                      );
                    } else {
                      setValue(
                        `steps.${currentActionId?.split(".")[0]}.${
                          currentActionId?.split(".")[1]
                        }.eta` as any,
                        null
                      );
                    }
                  }}
                  className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Attached Document</DialogTitle>
          </DialogHeader>
          {currentImage && (
            <div className="relative ">
              <img
                src={currentImage}
                alt="Attached Document"
                className="object-contain"
              />
            </div>
          )}
          <div className="space-y-4">
            {/* Action Plan Section */}
            <div>
              <Label htmlFor="actionPlan">Added Action Plan</Label>
              <Textarea
                id="actionPlan"
                name="actionPlan"
                placeholder="Enter your action plan here"
                defaultValue={
                  watch(`${currentFieldId}.actionPlan` as any) || ""
                } // Display empty string if no value is present
              />
            </div>

            {/* ETA Section */}
            <div>
              <label htmlFor="eta">Added ETA </label>
              <input
                type="date"
                id="eta"
                name="eta"
                defaultValue={
                  watch(`${currentFieldId}.actionplanETA` as any)
                    ? new Date(watch(`${currentFieldId}.actionplanETA` as any))
                        .toISOString()
                        .split("T")[0] // Extract YYYY-MM-DD from ISO 8601
                    : ""
                }
                // onChange={(e) => {
                //   const selectedDate = e.target.value
                //     ? new Date(e.target.value)
                //     : null;
                //   setValue(
                //     `steps.${currentActionId?.split(".")[0]}.${
                //       currentActionId?.split(".")[1]
                //     }.actionPlanETA` as any,
                //     selectedDate // Update form value
                //   );
                // }}
                className="w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300"
              />
            </div>
          </div>

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
