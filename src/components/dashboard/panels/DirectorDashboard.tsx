import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Home, Users, AlertTriangle, Activity } from "lucide-react";
import { useDashboardStore } from "@/lib/store";

interface HouseStats {
  id: string;
  name: string;
  totalBeds: number;
  occupiedBeds: number;
  maintenanceBeds: number;
  alerts: number;
  attendance: number;
  wellbeingScore: number;
}

const defaultHouses: HouseStats[] = [
  {
    id: "h1",
    name: "East Wing",
    totalBeds: 50,
    occupiedBeds: 45,
    maintenanceBeds: 2,
    alerts: 2,
    attendance: 95,
    wellbeingScore: 85,
  },
  {
    id: "h2",
    name: "West Wing",
    totalBeds: 50,
    occupiedBeds: 48,
    maintenanceBeds: 1,
    alerts: 1,
    attendance: 98,
    wellbeingScore: 90,
  },
  {
    id: "h3",
    name: "North Wing",
    totalBeds: 40,
    occupiedBeds: 35,
    maintenanceBeds: 2,
    alerts: 3,
    attendance: 92,
    wellbeingScore: 82,
  },
];

interface DirectorDashboardProps {
  houseId?: string;
}

export default function DirectorDashboard({
  houseId,
}: DirectorDashboardProps = {}) {
  const { currentUser } = useDashboardStore();
  const isHouseMaster = currentUser?.role === "House Master";
  const isDeputyHouseMaster = currentUser?.role === "Deputy House Master";

  // Filter houses based on role and assigned house
  const displayHouses =
    isHouseMaster || isDeputyHouseMaster
      ? defaultHouses.filter((house) => house.id === "h1") // Assuming East Wing (h1) is assigned to both House Master and Deputy
      : defaultHouses;
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Boarding Houses Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Home className="mr-2 h-5 w-5 text-blue-500" />
              Total Houses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{displayHouses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-500" />
              Total Occupancy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(
                (displayHouses.reduce(
                  (acc, house) => acc + house.occupiedBeds,
                  0,
                ) /
                  displayHouses.reduce(
                    (acc, house) => acc + house.totalBeds,
                    0,
                  )) *
                  100,
              )}
              %
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {displayHouses.reduce((acc, house) => acc + house.alerts, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-purple-500" />
              Avg Wellbeing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(
                displayHouses.reduce(
                  (acc, house) => acc + house.wellbeingScore,
                  0,
                ) / displayHouses.length,
              )}
              %
            </div>
          </CardContent>
        </Card>
      </div>

      <ScrollArea className="h-[calc(100vh-16rem)]">
        <div className="grid grid-cols-1 gap-6">
          {displayHouses.map((house) => {
            const occupancyRate = (house.occupiedBeds / house.totalBeds) * 100;
            const maintenanceRate =
              (house.maintenanceBeds / house.totalBeds) * 100;

            return (
              <Card key={house.id}>
                <CardHeader>
                  <CardTitle>{house.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Occupancy</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Total Beds</span>
                          <span>{house.totalBeds}</span>
                        </div>
                        <Progress value={occupancyRate} className="h-2" />
                        <div className="grid grid-cols-3 text-sm">
                          <div>
                            <p className="text-muted-foreground">Occupied</p>
                            <p className="font-medium">{house.occupiedBeds}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Maintenance</p>
                            <p className="font-medium">
                              {house.maintenanceBeds}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Available</p>
                            <p className="font-medium">
                              {house.totalBeds -
                                house.occupiedBeds -
                                house.maintenanceBeds}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Attendance</h3>
                      <div className="space-y-2">
                        <Progress value={house.attendance} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          {house.attendance}% present today
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Status & Discipline</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Active Alerts
                          </span>
                          <span className="font-medium">{house.alerts}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Wellbeing Score
                          </span>
                          <span className="font-medium">
                            {house.wellbeingScore}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Minor Infractions
                          </span>
                          <span className="font-medium text-yellow-600">3</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Major Infractions
                          </span>
                          <span className="font-medium text-red-600">1</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            Pending Reviews
                          </span>
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            2 Reviews
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
