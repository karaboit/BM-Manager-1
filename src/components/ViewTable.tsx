import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface Column {
  key: string;
  header: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ViewTableProps {
  selectable?: boolean;
  selectedRows?: string[];
  onRowSelect?: (id: string) => void;
  onSelectAll?: (ids: string[]) => void;
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
}

export function ViewTable({
  columns,
  data,
  onRowClick,
  selectable,
  selectedRows = [],
  onRowSelect,
  onSelectAll,
}: ViewTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {selectable && (
            <TableHead className="w-[50px]">
              <Checkbox
                checked={data.length > 0 && selectedRows.length === data.length}
                onCheckedChange={(checked) => {
                  if (checked && onSelectAll) {
                    onSelectAll(data.map((row) => row.id));
                  } else if (onSelectAll) {
                    onSelectAll([]);
                  }
                }}
              />
            </TableHead>
          )}
          {columns.map((column) => (
            <TableHead
              key={column.key}
              className={column.sortable ? "cursor-pointer select-none" : ""}
              onClick={() => {
                if (column.sortable) {
                  const newDirection =
                    sortField === column.key && sortDirection === "asc"
                      ? "desc"
                      : "asc";
                  setSortField(column.key);
                  setSortDirection(newDirection);
                }
              }}
            >
              <div className="flex items-center gap-1">
                {column.header}
                {column.sortable && (
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      sortField === column.key
                        ? sortDirection === "asc"
                          ? "rotate-180"
                          : "rotate-0"
                        : ""
                    }`}
                  />
                )}
              </div>
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, rowIndex) => (
          <TableRow
            key={rowIndex}
            onClick={() => onRowClick?.(row)}
            className={onRowClick ? "cursor-pointer hover:bg-accent" : ""}
          >
            {selectable && (
              <TableCell className="w-[50px]">
                <Checkbox
                  checked={selectedRows.includes(row.id)}
                  onCheckedChange={(checked) => {
                    if (checked && onRowSelect) {
                      onRowSelect(row.id);
                    } else if (onRowSelect) {
                      onRowSelect(row.id);
                    }
                  }}
                />
              </TableCell>
            )}
            {columns.map((column) => (
              <TableCell key={column.key}>
                {column.render
                  ? column.render(row[column.key], row)
                  : typeof row[column.key] === "object"
                    ? JSON.stringify(row[column.key])
                    : row[column.key]}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
