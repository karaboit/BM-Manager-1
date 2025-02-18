import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDashboardStore } from "@/lib/store";

const mockChildren = [
  { id: "B001", name: "John Smith" },
  { id: "B002", name: "Jane Smith" },
  { id: "B003", name: "Bob Smith" },
];

const ChildSelector = () => {
  const { selectedChildId, setSelectedChildId } = useDashboardStore();

  return (
    <div className="w-full border-b bg-background">
      <Tabs
        value={selectedChildId || mockChildren[0].id}
        onValueChange={setSelectedChildId}
      >
        <TabsList className="w-full justify-start">
          {mockChildren.map((child) => (
            <TabsTrigger
              key={child.id}
              value={child.id}
              className="data-[state=active]:bg-muted"
            >
              {child.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default ChildSelector;
