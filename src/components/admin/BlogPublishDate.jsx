import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const BlogPublishDate = ({ register, errors, watch, setValue }) => {
  const publishDate = watch("publishDate");

  const handleDateSelect = (date) => {
    // Format the date as YYYY-MM-DD for the input field
    const formattedDate = format(date, "yyyy-MM-dd");
    setValue("publishDate", formattedDate);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="publishDate">Publish Date</Label>
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !publishDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {publishDate ? (
                format(new Date(publishDate), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={publishDate ? new Date(publishDate) : undefined}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <Input
          id="publishDate"
          type="date"
          {...register("publishDate")}
          className="hidden"
        />
      </div>
      {errors.publishDate && (
        <p className="text-sm text-red-500">{errors.publishDate.message}</p>
      )}
      <p className="text-sm text-muted-foreground">
        Schedule posts for the future or backdate them. Posts scheduled for the
        future will only appear on the site after the publish date.
      </p>
    </div>
  );
};

export default BlogPublishDate;
