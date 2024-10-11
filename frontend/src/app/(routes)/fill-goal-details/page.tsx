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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, ChevronRight, ChevronLeft } from "lucide-react";
import { getFormDetails } from "@/services/formDetailsService";
import { Stepper } from "@/components/ui/stepper";
import Layout from "@/components/Layout/Layout";
import SidebarLayout from "@/app/sidebar-layout";
import Skeleton from "@/components/LoadingSkeleton/Skeleton";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hooks";
import { submitTrackingDetails } from "@/services/submitTrackingDetailsSlice";

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
}

const GoalDetailsForm = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<FormField[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { fields } = useFieldArray({ control, name: "goals" });

  // Check if user is authenticated
  const trackerId = useAppSelector(
    (state: any) => state.trackerDetails?.trackerId
  );

  useEffect(() => {
    fetchFormDetails();
  }, []);

  async function fetchFormDetails() {
    try {
      const response = await getFormDetails("T_M");
      if (Array.isArray(response)) {
        setFormData(response);
        setIsLoading(false);
      } else {
        console.error("Unexpected response format", response);
      }
    } catch (error) {
      console.log("Error fetching form details:", error);
    }
  }

  const onSubmit = async (data: FieldValues) => {
    const formattedGoals = Object.keys(data?.goals || {})
      .map((key) => ({
        actionId: parseInt(key, 10), // Assuming keys are actionId
        actionValue: data.goals[key],
      }))
      .filter(
        (goal) =>
          goal.actionValue !== null &&
          goal.actionValue !== "" &&
          goal.actionValue !== undefined
      ); // Filter out undefined, null, and empty values

    // Proceed with the filtered and formatted data
    const response = await submitTrackingDetails({ formattedGoals, trackerId });

    console.log(response);
  };

  const steps = [
    { title: "Code Quality", fields: formData.slice(0, 4) },
    { title: "Defect Metrics", fields: formData.slice(4, 8) },
    { title: "Performance & Coverage", fields: formData.slice(8) },
  ];

  const renderField = (field: FormField) => {
    switch (field.actionType) {
      case "OPTION":
        return (
          <Controller
            name={`goals.${field.actionId}`}
            control={control}
            // rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
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
            )}
          />
        );
      case "PERCENTAGE":
        return (
          <Controller
            name={`goals.${field.actionId}`}
            control={control}
            // rules={{ required: true, min: 0, max: 100 }}
            render={({ field: { onChange, value } }) => (
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  onChange={onChange}
                  value={value}
                  placeholder="Enter percentage"
                />
                <span>%</span>
              </div>
            )}
          />
        );
      case "NUMERIC":
        return (
          <Controller
            name={`goals.${field.actionId}`}
            control={control}
            // rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                type="number"
                onChange={onChange}
                value={value}
                placeholder="Enter number"
              />
            )}
          />
        );
      default:
        return (
          <Controller
            name={`goals.${field.actionId}`}
            control={control}
            // rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <Input
                type="text"
                onChange={onChange}
                value={value}
                placeholder="Enter value"
              />
            )}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div>
        {" "}
        <Layout>
          <SidebarLayout>
            <Skeleton />
          </SidebarLayout>
        </Layout>
      </div>
    );
  }

  return (
    <Layout>
      <SidebarLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-4xl mx-auto">
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
                {steps[currentStep].fields.map((field) => (
                  <div key={field.actionId} className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <Label
                        htmlFor={`action-${field.actionId}`}
                        className="text-sm font-medium"
                      >
                        {field.actionName}
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            field.actionCategory === "MAJOR"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {field.actionCategory}
                        </Badge>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info className="h-4 w-4 text-gray-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Benchmark: {field.benchmarkValue}</p>
                              {field.comparisonOperator && (
                                <p>
                                  Operator:{" "}
                                  {field.comparisonOperator
                                    .replace(/_/g, " ")
                                    .toLowerCase()}
                                </p>
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                    {renderField(field)}
                    {errors.goals?.[field.actionId] && (
                      <p className="text-red-500 text-xs mt-1">
                        This field is required
                      </p>
                    )}
                  </div>
                ))}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
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
          </Card>
        </div>
      </SidebarLayout>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(GoalDetailsForm), {
  ssr: false,
});
