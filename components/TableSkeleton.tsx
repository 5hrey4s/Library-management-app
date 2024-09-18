import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  columns: number;
  rows: number;
  showActions?: boolean;
  showCheckbox?: boolean;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({
  columns,
  rows,
  showActions = false,
  showCheckbox = false,
}) => {
  const shimmer =
    "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent relative overflow-hidden";
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Skeleton Header */}
      <div className="p-4">
        <Skeleton className={`h-8 w-48 mb-4 ${shimmer}`} />
        {/* Skeleton for Filter and Button */}
        <div className="flex flex-col sm:flex-row justify-end items-center gap-4 mb-6">
          <Skeleton className={`h-10 w-full sm:w-[180px] ${shimmer}`} />
          <Skeleton className={`h-10 w-full sm:w-auto ${shimmer}`} />
        </div>
      </div>

      {/* Skeleton Table */}
      <div className="w-full max-w-4xl mx-auto overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              {/* Table Headers Skeleton */}
              {Array.from({ length: columns }).map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className={`h-6 w-full max-w-[120px] ${shimmer}`} />
                </TableHead>
              ))}
              <TableHead className="text-right">
                <Skeleton className={`h-6 w-full max-w-[100px] ${shimmer}`} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Table Rows Skeleton */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <TableRow key={rowIndex}>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton className={`h-4 w-full ${shimmer}`} />
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Skeleton className={`h-8 w-24 ${shimmer}`} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Skeleton Pagination */}
      <div className="mt-8 flex justify-center gap-2">
        <Skeleton className={`h-8 w-8 rounded-full ${shimmer}`} />
        <Skeleton className={`h-8 w-8 rounded-full ${shimmer}`} />
        <Skeleton className={`h-8 w-8 rounded-full ${shimmer}`} />
      </div>
    </div>
  );
};

export default TableSkeleton;
