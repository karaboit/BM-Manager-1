import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Home } from "lucide-react";

interface HouseOverviewProps {
  house: {
    id: string;
    name: string;
    totalBeds: number;
    occupiedBeds: number;
    maintenanceBeds: number;
  };
  onSelect: (houseId: string) => void;
  isSelected: boolean;
}

export default function HouseOverview({
  house,
  onSelect,
  isSelected,
}: HouseOverviewProps) {
  const occupancyRate = (house.occupiedBeds / house.totalBeds) * 100;
  const maintenanceRate = (house.maintenanceBeds / house.totalBeds) * 100;
  const availableRate = 100 - occupancyRate - maintenanceRate;

  return (
    <Card
      className={`cursor-pointer hover:border-primary transition-colors ${isSelected ? "border-primary" : ""}`}
      onClick={() => onSelect(house.id)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5" />
          {house.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Occupancy</span>
            <span>{Math.round(occupancyRate)}%</span>
          </div>
          <div className="flex gap-1 h-2">
            <div
              className="bg-green-500 rounded-l"
              style={{ width: `${occupancyRate}%` }}
            />
            <div
              className="bg-yellow-500"
              style={{ width: `${maintenanceRate}%` }}
            />
            <div
              className="bg-blue-500 rounded-r"
              style={{ width: `${availableRate}%` }}
            />
          </div>
          <div className="grid grid-cols-3 text-sm">
            <div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span>Occupied</span>
              </div>
              <p className="font-medium">{house.occupiedBeds}</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-500" />
                <span>Maintenance</span>
              </div>
              <p className="font-medium">{house.maintenanceBeds}</p>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span>Available</span>
              </div>
              <p className="font-medium">
                {house.totalBeds - house.occupiedBeds - house.maintenanceBeds}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
