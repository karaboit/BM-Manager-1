import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, UtensilsCrossed } from "lucide-react";

interface MenuTemplate {
  id: string;
  name: string;
  type: "breakfast" | "lunch" | "dinner";
  items: string;
  dietaryNotes?: string;
}

const defaultTemplates: MenuTemplate[] = [
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
  {
    id: "4",
    name: "Vegetarian Breakfast",
    type: "breakfast",
    items: "Oatmeal, Fruit, Yogurt",
    dietaryNotes: "100% vegetarian",
  },
  {
    id: "5",
    name: "Vegetarian Lunch",
    type: "lunch",
    items: "Veggie Wraps, Salad",
    dietaryNotes: "100% vegetarian",
  },
  {
    id: "6",
    name: "Vegetarian Dinner",
    type: "dinner",
    items: "Stir-fry Vegetables, Tofu",
    dietaryNotes: "100% vegetarian",
  },
];

interface MenuTemplatesProps {
  onSelect?: (template: MenuTemplate) => void;
}

const MenuTemplates = ({ onSelect }: MenuTemplatesProps) => {
  const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
  const [templates, setTemplates] = useState<MenuTemplate[]>(defaultTemplates);
  const [selectedType, setSelectedType] = useState<
    "breakfast" | "lunch" | "dinner"
  >("breakfast");
  const [newTemplate, setNewTemplate] = useState<Omit<MenuTemplate, "id">>({
    name: "",
    type: "breakfast",
    items: "",
    dietaryNotes: "",
  });

  const handleCreateTemplate = () => {
    const template = {
      ...newTemplate,
      id: Date.now().toString(),
    };
    setTemplates([...templates, template]);
    setIsNewTemplateOpen(false);
    setNewTemplate({
      name: "",
      type: "breakfast",
      items: "",
      dietaryNotes: "",
    });
  };

  const filteredTemplates = templates.filter(
    (template) => template.type === selectedType,
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Select
          value={selectedType}
          onValueChange={(value: "breakfast" | "lunch" | "dinner") =>
            setSelectedType(value)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select meal type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="breakfast">Breakfast Templates</SelectItem>
            <SelectItem value="lunch">Lunch Templates</SelectItem>
            <SelectItem value="dinner">Dinner Templates</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isNewTemplateOpen} onOpenChange={setIsNewTemplateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Template
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Menu Template</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Template Name</Label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, name: e.target.value })
                  }
                  placeholder="e.g., Standard Breakfast"
                />
              </div>
              <div className="grid gap-2">
                <Label>Meal Type</Label>
                <Select
                  value={newTemplate.type}
                  onValueChange={(value: "breakfast" | "lunch" | "dinner") =>
                    setNewTemplate({ ...newTemplate, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Menu Items</Label>
                <Textarea
                  value={newTemplate.items}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, items: e.target.value })
                  }
                  placeholder="Enter menu items"
                />
              </div>
              <div className="grid gap-2">
                <Label>Dietary Notes</Label>
                <Textarea
                  value={newTemplate.dietaryNotes}
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      dietaryNotes: e.target.value,
                    })
                  }
                  placeholder="Enter any dietary notes"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsNewTemplateOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>Create Template</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <ScrollArea className="h-[500px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template) => (
            <Card
              key={template.id}
              className="cursor-pointer hover:bg-accent"
              onClick={() => onSelect?.(template)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div>
                    <Label className="text-sm font-semibold">Menu Items</Label>
                    <p className="text-sm text-muted-foreground">
                      {template.items}
                    </p>
                  </div>
                  {template.dietaryNotes && (
                    <div>
                      <Label className="text-sm font-semibold">
                        Dietary Notes
                      </Label>
                      <p className="text-sm text-muted-foreground">
                        {template.dietaryNotes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuTemplates;
