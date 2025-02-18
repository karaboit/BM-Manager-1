import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Activity, AlertTriangle, Heart } from "lucide-react";
import { WellbeingSurvey } from "@/types";
import { useDashboardStore } from "@/lib/store";

interface WellbeingPanelProps {
  surveys?: WellbeingSurvey[];
}

const defaultSurveys: WellbeingSurvey[] = [
  {
    survey_id: "1",
    boarder_id: "B001",
    created_at: "2024-03-21T10:00:00Z",
    responses: {
      mood: 4,
      sleep: 7,
      stress: false,
      loneliness: 2,
      physical_discomfort: false,
    },
    risk_score: 2,
  },
];

const WellbeingPanel = ({ surveys = defaultSurveys }: WellbeingPanelProps) => {
  const [isNewSurveyOpen, setIsNewSurveyOpen] = useState(false);
  const { currentUser } = useDashboardStore();
  const isMedicalStaff = currentUser?.role === "Medical Staff";

  const calculateRiskLevel = (score: number) => {
    if (score <= 2) return "Low";
    if (score <= 5) return "Medium";
    return "High";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Wellbeing Survey</h1>
        {!isMedicalStaff && (
          <Dialog open={isNewSurveyOpen} onOpenChange={setIsNewSurveyOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Take Survey
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Wellbeing Survey</DialogTitle>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="space-y-2">
                  <Label>How would you rate your overall mood today?</Label>
                  <RadioGroup defaultValue="3" className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={value.toString()}
                          id={`mood-${value}`}
                        />
                        <Label htmlFor={`mood-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label>How many hours of sleep did you get last night?</Label>
                  <Input
                    type="number"
                    min="0"
                    max="12"
                    placeholder="Hours of sleep"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="stress" />
                  <Label htmlFor="stress">
                    Have you felt stressed or anxious recently?
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>
                    How lonely or isolated have you felt in the past few days?
                  </Label>
                  <RadioGroup defaultValue="3" className="flex gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={value.toString()}
                          id={`lonely-${value}`}
                        />
                        <Label htmlFor={`lonely-${value}`}>{value}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="physical" />
                    <Label htmlFor="physical">
                      Any physical discomfort or pain you want to report?
                    </Label>
                  </div>
                  <Textarea placeholder="Please describe any physical discomfort..." />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsNewSurveyOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={() => setIsNewSurveyOpen(false)}>
                  Submit Survey
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isMedicalStaff ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {surveys.filter((s) => (s.risk_score || 0) > 5).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5 text-yellow-500" />
                Medium Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {
                  surveys.filter(
                    (s) => (s.risk_score || 0) > 2 && (s.risk_score || 0) <= 5,
                  ).length
                }
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5 text-green-500" />
                Low Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {surveys.filter((s) => (s.risk_score || 0) <= 2).length}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>
            {isMedicalStaff ? "Survey Responses" : "My Survey History"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                {isMedicalStaff && <TableHead>Boarder ID</TableHead>}
                <TableHead>Mood</TableHead>
                <TableHead>Sleep</TableHead>
                <TableHead>Stress</TableHead>
                <TableHead>Loneliness</TableHead>
                <TableHead>Physical Issues</TableHead>
                {isMedicalStaff && <TableHead>Risk Level</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.survey_id}>
                  <TableCell>
                    {new Date(survey.created_at).toLocaleDateString()}
                  </TableCell>
                  {isMedicalStaff && <TableCell>{survey.boarder_id}</TableCell>}
                  <TableCell>{survey.responses.mood}/5</TableCell>
                  <TableCell>{survey.responses.sleep}h</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${survey.responses.stress ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {survey.responses.stress ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>{survey.responses.loneliness}/5</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-sm ${survey.responses.physical_discomfort ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
                    >
                      {survey.responses.physical_discomfort ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  {isMedicalStaff && (
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-sm ${
                          calculateRiskLevel(survey.risk_score || 0) === "High"
                            ? "bg-red-100 text-red-800"
                            : calculateRiskLevel(survey.risk_score || 0) ===
                                "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {calculateRiskLevel(survey.risk_score || 0)}
                      </span>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WellbeingPanel;
