import React from "react";
import { cn } from "@/lib/utils";

interface StepProps {
  label: string;
  isActive: boolean;
  isCompleted: boolean;
}

export const Step: React.FC<StepProps> = ({ label, isActive, isCompleted }) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center",
        isActive && "font-bold",
        isCompleted && "text-green-500"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2",
          isActive && "border-blue-500 bg-blue-100",
          isCompleted && "border-green-500 bg-green-100",
          !isActive && !isCompleted && "border-gray-300"
        )}
      >
        {isCompleted ? "✓" : ""}
      </div>
      <span className="text-sm">{label}</span>
    </div>
  );
};

interface StepperProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  className,
}) => {
  return (
    <div className={cn("flex justify-between w-full", className)}>
      {steps.map((step, index) => (
        <React.Fragment key={step}>
          <Step
            label={step}
            isActive={currentStep === index}
            isCompleted={currentStep > index}
          />
          {index < steps.length - 1 && (
            <div className="flex-grow border-t-2 border-gray-200 mt-4" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
