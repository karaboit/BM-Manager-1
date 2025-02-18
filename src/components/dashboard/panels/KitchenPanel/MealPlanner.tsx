import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UtensilsCrossed } from "lucide-react";

interface MenuTemplate {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  items: string;
  dietaryNotes?: string;
}

interface MealPlannerProps {
  onSave?: (mealPlan: any) => void;
  templates?: MenuTemplate[];
}

const MealPlanner = ({ onSave, templates = [] }: MealPlannerProps) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [meals, setMeals] = React.useState({
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  const handleTemplateSelect = (
    type: "breakfast" | "lunch" | "dinner",
    templateId: string,
  ) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setMeals((prev) => ({
        ...prev,
        [type]: template.items,
      }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UtensilsCrossed className="mr-2 h-5 w-5" />
          Meal Planner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Breakfast</Label>
                <Select
                  onValueChange={(value) =>
                    handleTemplateSelect("breakfast", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter((t) => t.type === "breakfast")
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={meals.breakfast}
                onChange={(e) =>
                  setMeals((prev) => ({ ...prev, breakfast: e.target.value }))
                }
                placeholder="Enter breakfast menu"
                className="mt-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Lunch</Label>
                <Select
                  onValueChange={(value) =>
                    handleTemplateSelect("lunch", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter((t) => t.type === "lunch")
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={meals.lunch}
                onChange={(e) =>
                  setMeals((prev) => ({ ...prev, lunch: e.target.value }))
                }
                placeholder="Enter lunch menu"
                className="mt-2"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Dinner</Label>
                <Select
                  onValueChange={(value) =>
                    handleTemplateSelect("dinner", value)
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates
                      .filter((t) => t.type === "dinner")
                      .map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <Textarea
                value={meals.dinner}
                onChange={(e) =>
                  setMeals((prev) => ({ ...prev, dinner: e.target.value }))
                }
                placeholder="Enter dinner menu"
                className="mt-2"
              />
            </div>
            <Button
              className="w-full"
              onClick={() => onSave?.({ date, meals })}
            >
              Save Meal Plan
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MealPlanner;
