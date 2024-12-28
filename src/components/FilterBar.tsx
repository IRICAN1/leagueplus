import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { useState } from "react";

export const FilterBar = () => {
  const [date, setDate] = useState<Date>();

  return (
    <div className="flex flex-wrap gap-4 p-6 bg-gray-800/80 backdrop-blur-sm rounded-lg animate-slide-in shadow-md hover:shadow-lg transition-all duration-300 border border-blue-500/20">
      <Select>
        <SelectTrigger className="w-[180px] bg-gray-700/80 text-blue-100 border-blue-300/20">
          <SelectValue placeholder="Sport" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tennis">Tennis</SelectItem>
          <SelectItem value="football">Football</SelectItem>
          <SelectItem value="basketball">Basketball</SelectItem>
        </SelectContent>
      </Select>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[180px] justify-start text-left font-normal bg-gray-700/80 text-blue-100 border-blue-300/20"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <Select>
        <SelectTrigger className="w-[180px] bg-gray-700/80 text-blue-100 border-blue-300/20">
          <SelectValue placeholder="Level" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[180px] bg-gray-700/80 text-blue-100 border-blue-300/20">
          <SelectValue placeholder="Competition Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tournament">Tournament</SelectItem>
          <SelectItem value="league">League</SelectItem>
          <SelectItem value="friendly">Friendly</SelectItem>
        </SelectContent>
      </Select>

      <Button
        variant="ghost"
        size="icon"
        className="ml-auto hover:bg-blue-900/50 text-blue-300"
        title="Reset filters"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};