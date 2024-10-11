"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "../../ui/label";

interface DatePickerProps {
  label: string;
  selectedDate: Date | null;
  onDateChange: (date: Date) => void;
  isOpen: boolean;
  onOpen: () => void;
}

export function DatePicker({
  label,
  selectedDate,
  onDateChange,
  isOpen,
  onOpen,
}: DatePickerProps) {
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateChange(date); // Trigger date change
      // No need to close the popover here, handled in parent
    }
  };

  return (
    <div>
      <Label>{label}</Label>
      <Popover open={isOpen} onOpenChange={onOpen}>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !selectedDate && "text-muted-foreground"
            )}
            onClick={onOpen} // Call onOpen when clicked
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? (
              format(selectedDate, "PPP")
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
      </Popover>

      {/* Calendar Component Outside of PopoverContent */}
      {isOpen && (
        <div className="absolute z-20 top-4 bg-white border border-gray-200 rounded shadow-md">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={handleDateSelect}
          />
        </div>
      )}
    </div>
  );
}
