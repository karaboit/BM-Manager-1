import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  UtensilsCrossed,
  AlertTriangle,
  FileText,
  Package,
  FileDown,
  ChevronLeft,
} from "lucide-react";
import MealPlanner from "./KitchenPanel/MealPlanner";
import MenuTemplates from "./KitchenPanel/MenuTemplates";
import DietaryRequirements from "./KitchenPanel/DietaryRequirements";
import { useDashboardStore } from "@/lib/store";

const defaultDietaryRequirements = [
  {
    boarderId: "B001",
    name: "John Smith",
    restrictions: ["Vegetarian"],
    allergies: ["Peanuts", "Shellfish"],
    notes: "Severe peanut allergy",
  },
  {
    boarderId: "B002",
    name: "Jane Doe",
    restrictions: ["Halal"],
    allergies: ["Dairy"],
    notes: "Lactose intolerant",
  },
];

const defaultTemplates = [
  {
    id: "1",
    name: "Standard Breakfast",
    type: "breakfast",
    items: "Eggs, Toast, Cereal, Fruit",
    dietaryNotes: "Vegetarian options available",
  },
  {
    id: "2",
    name: "Light Lunch",
    type: "lunch",
    items: "Sandwiches, Salad, Fruit",
    dietaryNotes: "Vegetarian options available",
  },
  {
    id: "3",
    name: "Standard Dinner",
    type: "dinner",
    items: "Chicken, Rice, Vegetables",
    dietaryNotes: "Vegetarian options available",
  },
];

interface KitchenPanelProps {
  showDashboard?: boolean;
}

const generateMealData = (date: Date) => ({
  breakfast: {
    time: "7:00 - 8:30",
    menu: "Eggs, Toast, Cereal, Fruit",
    dietaryNotes: "Vegetarian options available",
    status: "pending",
    expectedBoarders: 142,
    outsideMeals: 3,
    dietaryRequirements: [
      { type: "Vegetarian", count: 12 },
      { type: "Halal", count: 8 },
      { type: "Gluten Free", count: 3 },
    ],
    allergies: [
      { type: "Peanuts", count: 4 },
      { type: "Dairy", count: 6 },
    ],
    absentBoarders: [
      { reason: "Leave", count: 5 },
      { reason: "Off Campus", count: 3 },
    ],
  },
  lunch: {
    time: "12:00 - 13:30",
    menu: "Sandwiches, Salad, Fruit",
    dietaryNotes: "Vegetarian options available",
    status: "pending",
    expectedBoarders: 140,
    outsideMeals: 5,
    dietaryRequirements: [
      { type: "Vegetarian", count: 12 },
      { type: "Halal", count: 8 },
      { type: "Gluten Free", count: 3 },
    ],
    allergies: [
      { type: "Peanuts", count: 4 },
      { type: "Dairy", count: 6 },
    ],
    absentBoarders: [
      { reason: "Leave", count: 8 },
      { reason: "Off Campus", count: 2 },
    ],
  },
  dinner: {
    time: "18:00 - 19:30",
    menu: "Chicken, Rice, Vegetables",
    dietaryNotes: "Vegetarian options available",
    status: "pending",
    expectedBoarders: 145,
    outsideMeals: 2,
    dietaryRequirements: [
      { type: "Vegetarian", count: 12 },
      { type: "Halal", count: 8 },
      { type: "Gluten Free", count: 3 },
    ],
    allergies: [
      { type: "Peanuts", count: 4 },
      { type: "Dairy", count: 6 },
    ],
    absentBoarders: [
      { reason: "Leave", count: 4 },
      { reason: "Off Campus", count: 1 },
    ],
  },
});

const KitchenPanel = ({ showDashboard = false }: KitchenPanelProps) => {
  const { currentUser, activePanel } = useDashboardStore();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("meal-planner");
  const [selectedMeal, setSelectedMeal] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"today" | "future">("today");
  const [selectedDateMeals, setSelectedDateMeals] = useState(
    generateMealData(new Date()),
  );

  const todaysMeals = {
    breakfast: {
      time: "7:00 - 8:30",
      menu: "Eggs, Toast, Cereal, Fruit",
      dietaryNotes: "Vegetarian options available",
      status: "completed",
      expectedBoarders: 150,
      outsideMeals: 5,
      dietaryRequirements: [
        { type: "Vegetarian", count: 12 },
        { type: "Halal", count: 8 },
        { type: "Gluten Free", count: 3 },
      ],
      allergies: [
        { type: "Peanuts", count: 4 },
        { type: "Dairy", count: 6 },
      ],
      absentBoarders: [
        { reason: "Leave", count: 3 },
        { reason: "Off Campus", count: 2 },
      ],
    },
    lunch: {
      time: "12:00 - 13:30",
      menu: "Sandwiches, Salad, Fruit",
      dietaryNotes: "Vegetarian options available",
      status: "in-progress",
      expectedBoarders: 145,
      outsideMeals: 8,
      dietaryRequirements: [
        { type: "Vegetarian", count: 12 },
        { type: "Halal", count: 8 },
        { type: "Gluten Free", count: 3 },
      ],
      allergies: [
        { type: "Peanuts", count: 4 },
        { type: "Dairy", count: 6 },
      ],
      absentBoarders: [
        { reason: "Leave", count: 5 },
        { reason: "Off Campus", count: 3 },
      ],
    },
    dinner: {
      time: "18:00 - 19:30",
      menu: "Chicken, Rice, Vegetables",
      dietaryNotes: "Vegetarian options available",
      status: "pending",
      expectedBoarders: 148,
      outsideMeals: 2,
      dietaryRequirements: [
        { type: "Vegetarian", count: 12 },
        { type: "Halal", count: 8 },
        { type: "Gluten Free", count: 3 },
      ],
      allergies: [
        { type: "Peanuts", count: 4 },
        { type: "Dairy", count: 6 },
      ],
      absentBoarders: [
        { reason: "Leave", count: 2 },
        { reason: "Off Campus", count: 0 },
      ],
    },
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date && date.getTime() !== selectedDate.getTime()) {
      setSelectedDate(date);
      setViewMode("future");
      setSelectedDateMeals(generateMealData(date));
    }
  };

  const handleExportPDF = async () => {
    const meals = viewMode === "today" ? todaysMeals : selectedDateMeals;
    const dateStr =
      viewMode === "today" ? "Today" : selectedDate.toLocaleDateString();

    try {
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      let yPos = 20;

      // Title
      doc.setFontSize(20);
      doc.setTextColor(0, 0, 0);
      doc.text(`Meal Plan for ${dateStr}`, 20, yPos);
      yPos += 20;

      // Meals
      Object.entries(meals).forEach(([meal, details]) => {
        // Meal header
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text(`${meal.toUpperCase()} - ${details.time}`, 20, yPos);
        yPos += 10;

        // Menu and counts
        doc.setFontSize(12);
        doc.text(`Menu: ${details.menu}`, 25, yPos);
        yPos += 7;
        doc.text(`Expected Boarders: ${details.expectedBoarders}`, 25, yPos);
        yPos += 7;
        doc.text(`Outside Meals: ${details.outsideMeals}`, 25, yPos);
        yPos += 7;
        doc.text(
          `Total: ${details.expectedBoarders + details.outsideMeals}`,
          25,
          yPos,
        );
        yPos += 10;

        // Dietary Requirements
        if (details.dietaryRequirements.length > 0) {
          doc.setFontSize(14);
          doc.text("Dietary Requirements:", 25, yPos);
          yPos += 7;
          doc.setFontSize(12);
          details.dietaryRequirements.forEach((req) => {
            doc.text(`• ${req.type}: ${req.count}`, 30, yPos);
            yPos += 7;
          });
          yPos += 3;
        }

        // Allergies
        if (details.allergies.length > 0) {
          doc.setFontSize(14);
          doc.text("Allergies:", 25, yPos);
          yPos += 7;
          doc.setFontSize(12);
          details.allergies.forEach((allergy) => {
            doc.text(`• ${allergy.type}: ${allergy.count}`, 30, yPos);
            yPos += 7;
          });
          yPos += 3;
        }

        // Absent Boarders
        if (details.absentBoarders.length > 0) {
          doc.setFontSize(14);
          doc.text("Absent Boarders:", 25, yPos);
          yPos += 7;
          doc.setFontSize(12);
          details.absentBoarders.forEach((absent) => {
            doc.text(`• ${absent.reason}: ${absent.count}`, 30, yPos);
            yPos += 7;
          });
        }

        yPos += 15;

        // Add a page if we're running out of space
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
      });

      // Save the PDF
      const filename = `meal-plan-${dateStr.toLowerCase().replace(/\s/g, "-")}.pdf`;
      doc.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  // Show dashboard if explicitly requested or if we're on the dashboard panel
  if (showDashboard || activePanel === "dashboard") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Kitchen Dashboard</h1>
          <div className="flex gap-2">
            {viewMode === "future" ? (
              <Button
                variant="outline"
                onClick={() => {
                  setViewMode("today");
                  setSelectedDate(new Date());
                }}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Today
              </Button>
            ) : (
              <Button variant="outline" onClick={() => setViewMode("future")}>
                View Future Meals
              </Button>
            )}
            <Button variant="outline" onClick={handleExportPDF}>
              <FileDown className="mr-2 h-4 w-4" />
              Export to PDF
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === "today"
                  ? "Today's Meals"
                  : `Meals for ${selectedDate.toLocaleDateString()}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(
                viewMode === "today" ? todaysMeals : selectedDateMeals,
              ).map(([meal, details]) => (
                <div key={meal} className="space-y-2">
                  <div
                    className="bg-muted p-4 rounded-lg space-y-2 cursor-pointer hover:bg-accent transition-colors"
                    onClick={() => setSelectedMeal(meal)}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold capitalize">{meal}</h3>
                      <span
                        className={`px-2 py-1 text-sm rounded-full ${
                          details.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : details.status === "in-progress"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {details.status === "completed"
                          ? "Completed"
                          : details.status === "in-progress"
                            ? "In Progress"
                            : "Pending"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {details.time}
                    </p>
                    <p className="font-medium">{details.menu}</p>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-sm text-muted-foreground">
                        {details.dietaryNotes}
                      </p>
                      <p className="text-sm font-medium">
                        {details.expectedBoarders} expected
                      </p>
                    </div>
                  </div>

                  {selectedMeal === meal && (
                    <div className="mt-4 space-y-4 p-4 border rounded-lg">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Attendance {viewMode === "future" && "(Expected)"}
                          </h4>
                          <div className="space-y-1">
                            <p className="text-sm">
                              Expected Boarders: {details.expectedBoarders}
                            </p>
                            <p className="text-sm">
                              Outside Meals: {details.outsideMeals}
                            </p>
                            <p className="text-sm font-medium">
                              Total:{" "}
                              {details.expectedBoarders + details.outsideMeals}
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">
                            Absent Boarders
                          </h4>
                          <div className="space-y-1">
                            {details.absentBoarders.map((absent, i) => (
                              <p key={i} className="text-sm">
                                {absent.reason}: {absent.count}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold mb-2">
                            Dietary Requirements
                          </h4>
                          <div className="space-y-1">
                            {details.dietaryRequirements.map((req, i) => (
                              <p key={i} className="text-sm">
                                {req.type}: {req.count}
                              </p>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Allergies</h4>
                          <div className="space-y-1">
                            {details.allergies.map((allergy, i) => (
                              <p key={i} className="text-sm">
                                {allergy.type}: {allergy.count}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">
                        {defaultDietaryRequirements.length}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Dietary Requirements
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="font-semibold">
                        {defaultTemplates.length}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Menu Templates
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-red-500" />
                      <span className="font-semibold">5</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Low Stock Items
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <UtensilsCrossed className="h-5 w-5 text-blue-500" />
                      <span className="font-semibold">3</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Meals Today</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Meal Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  className="rounded-md border w-full"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Show management interface
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kitchen Management</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value="meal-planner">Meal Planner</TabsTrigger>
          <TabsTrigger value="templates">Menu Templates</TabsTrigger>
          <TabsTrigger value="dietary-requirements">
            Dietary Requirements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="meal-planner" className="space-y-4">
          <MealPlanner onSave={console.log} templates={defaultTemplates} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <MenuTemplates
            onSelect={(template) => {
              setActiveTab("meal-planner");
            }}
          />
        </TabsContent>

        <TabsContent value="dietary-requirements" className="space-y-4">
          <DietaryRequirements requirements={defaultDietaryRequirements} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KitchenPanel;
