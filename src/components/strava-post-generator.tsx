import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TemplateName } from "@/types/strava";
import { PaceCounter, timeConverter } from "@/hooks/logic";
import { TemplatePreview } from "./template-preview";

export function StravaPostGenerator({ activities }) {
  const [selectedActivity, setSelectedActivity] = useState(null);

  const templates = TemplateName; // Array of template names

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(activities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentActivities = activities.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="grid gap-6 sm:grid-cols-[20%_80%]">
      {/* Left block: Select activity */}
      <Card>
        <CardHeader>
          <CardTitle>Select Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {currentActivities.map((activity) => (
              <li key={activity.id}>
                <Button
                  variant={
                    selectedActivity?.id === activity.id ? "default" : "outline"
                  }
                  className="w-full"
                  onClick={() => setSelectedActivity(activity)}
                >
                  {activity.name}
                </Button>
              </li>
            ))}
          </ul>

          {/* Pagination */}
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      {/* Right block: Preview all templates */}
      <Card className="max-w-full bg-transparent border-0">
        <CardHeader>
          <CardTitle className="text-white">Preview All Templates</CardTitle>
        </CardHeader>
        <CardContent >
          {selectedActivity ? (
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 ">
              {templates.map((template, index) => (
                <TemplatePreview
                  key={index}
                  activity={selectedActivity}
                  template={template}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              Select an activity to preview.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
