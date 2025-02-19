import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WellbeingSurvey } from "@/types";

const defaultSurveys: WellbeingSurvey[] = [];

const calculateRiskLevel = (score: number) => {
  if (score <= 2) return "Low";
  if (score <= 5) return "Medium";
  return "High";
};

const WellbeingHistoryTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wellbeing Survey History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Mood</TableHead>
              <TableHead>Sleep</TableHead>
              <TableHead>Stress</TableHead>
              <TableHead>Loneliness</TableHead>
              <TableHead>Physical Issues</TableHead>
              <TableHead>Risk Level</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {defaultSurveys.map((survey) => (
              <TableRow key={survey.survey_id}>
                <TableCell>
                  {new Date(survey.created_at).toLocaleDateString()}
                </TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WellbeingHistoryTab;
