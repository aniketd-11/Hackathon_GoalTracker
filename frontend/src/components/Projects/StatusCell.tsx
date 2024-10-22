import { TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Play,
  Search,
  Loader,
  CheckCircle,
  HelpCircle,
} from "lucide-react";

interface StatusCellProps {
  status: string;
}

export default function StatusCell({ status }: StatusCellProps) {
  const getStatusDetails = (status: string) => {
    switch (status) {
      case "DRAFT":
        return {
          label: "In Draft",
          icon: FileText,
          color: "bg-gray-100 text-gray-800",
        };
      case "INITIATED":
        return {
          label: "Initiated",
          icon: Play,
          color: "bg-blue-100 text-blue-800",
        };
      case "IN_REVIEW":
        return {
          label: "In Review",
          icon: Search,
          color: "bg-yellow-100 text-yellow-800",
        };
      case "IN_PROGRESS":
        return {
          label: "In Progress",
          icon: Loader,
          color: "bg-orange-100 text-orange-800",
        };
      case "IN_CLOSURE":
        return {
          label: "In Closure",
          icon: CheckCircle,
          color: "bg-purple-100 text-purple-800",
        };
      case "CLOSED":
        return {
          label: "Closed",
          icon: CheckCircle,
          color: "bg-green-100 text-green-800",
        };
      default:
        return {
          label: "No status",
          icon: HelpCircle,
          color: "bg-gray-100 text-gray-800",
        };
    }
  };

  const { label, icon: Icon, color } = getStatusDetails(status);

  return (
    <TableCell>
      <Badge
        variant="outline"
        className={`flex items-center gap-2 w-fit rounded-full ${color}`}
      >
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </Badge>
    </TableCell>
  );
}
