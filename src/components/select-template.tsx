import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { type ActivityTemplate } from "@/types/strava";
import { Link, useParams } from "react-router-dom";
import { Navbar } from "./ui/navbar";
import { ArrowDownToLine, Paintbrush} from "lucide-react";
import { ChromePicker} from "react-color";

export function ActivityTemplatePage() {
  const { id } = useParams();
  const [templates, setTemplates] = useState<Record<number, ActivityTemplate[]>>({});
  const [tplLoading, setTplLoading] = useState(true);
  const AthleteId = localStorage.getItem("strava_athlete_id");
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [submitting, setSubmitting] = useState(false);



  if (!AthleteId) {
    window.location.href = "/";
  }

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 8;

  const fetchPage = async (p: number, colorParam?: string): Promise<ActivityTemplate[]> => {
  const url = new URL(`${import.meta.env.VITE_API_URL}/api/activities/${id}/templates`);
  url.searchParams.set("page", p.toString());
  url.searchParams.set("limit", limit.toString());
  url.searchParams.set("athlete", AthleteId || "");
  if (colorParam) url.searchParams.set("color", colorParam);


  const res = await fetch(url.toString());
  const data = await res.json();
  return data.templates || [];
  };

  useEffect(() => {
    const load = async () => {
      setTplLoading(true);

      // fetch current page kalau belum ada
      if (!templates[currentPage]) {
        const current = await fetchPage(currentPage);
        setTemplates((prev) => ({ ...prev, [currentPage]: current }));
      }

      // prefetch next page
      if (!templates[currentPage + 1]) {
        const next = await fetchPage(currentPage + 1);
        if (next.length > 0) {
          setTemplates((prev) => ({ ...prev, [currentPage + 1]: next }));
        }
      }

      setTplLoading(false);
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, id]);

  const templateShow = templates[currentPage] || [];

  const handleSubmit = async (color?: string) => {
  const chosenColor = color || bgColor;
  console.log("Submitting color:", chosenColor);

  setShowColorPicker(false);
  setSubmitting(true);

  const current = await fetchPage(currentPage, chosenColor.replace("#", ""));
  setTemplates((prev) => ({ ...prev, [currentPage]: current }));

  const next = await fetchPage(currentPage + 1, chosenColor.replace("#", ""));
  if (next.length > 0) {
    setTemplates((prev) => ({ ...prev, [currentPage + 1]: next }));
  }

  setSubmitting(false);
};




  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/bg5.jpg')",
        backgroundPosition: "center 65%",
      }}
    >
      <div />
      <Navbar />

      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-row justify-between items-center font-crimson mb-3 text-2xl">
          <Link
            to="/activities"
            className="hover:underline hover:text-gray-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-arrow-left-icon lucide-arrow-left"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </Link>
          <h2
          >
            CHOOSE YOUR TEMPLATE
          </h2>
          <div className="relative inline-block">
            <button
              className="p-1.5"
              // style={{ backgroundColor: bgColor + "4D" , borderRadius: "4px"}}
              onClick={() => setShowColorPicker(!showColorPicker)}
            >
              <Paintbrush
                size={24}
                strokeWidth={1}
                fill={bgColor == "#ffffff" ? "none" : bgColor}
              />
            </button>

            {showColorPicker && (
              <div className="absolute right-0 mt-2 z-10">
                {/* Overlay */}
                <div
                  className="fixed inset-0"
                  onClick={() => setShowColorPicker(false)}
                />

                {/* Color picker box (higher z-index) */}
                <div className="relative z-20 bg-white shadow-lg rounded">
                  <ChromePicker
                    color={bgColor}
                    onChangeComplete={(color) => setBgColor(color.hex)}
                  />
                  <button
                    className="bg-black text-white w-full text-sm tracking-wide p-1.5"
                    onClick={() => handleSubmit()}
                  >
                    SUBMIT
                  </button>
                  <button
                    className="bg-white text-black w-full text-sm tracking-wide p-1.5"
                    onClick={() => { setBgColor("#ffffff"); handleSubmit("#ffffff"); }}
                  >
                    RESET
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-calsans">
          {submitting || (tplLoading && !templates[currentPage])
            ? // Skeleton ketika pertama kali load page
              Array.from({ length: 8 }).map((_, idx) => (
                <Card
                  key={idx}
                  className="p-4 rounded-none 
                            bg-white/20 dark:bg-black/20 
                            backdrop-blur-md 
                            border border-transparent"
                >
                  <Skeleton className="w-auto h-80 opacity-20 rounded-none" />
                </Card>
              ))
            : templateShow.map((tpl) => (
                <Card
                  key={tpl.id}
                  className="p-4 rounded-none 
                              bg-black/20 dark:bg-black/40 
                              backdrop-blur-md 
                              hover:bg-white/30 dark:hover:bg-black/30
                              hover:text-white 
                              transition-colors duration-300 
                              border border-transparent hover:border-white
                              relative"
                >
                  <div className="relative">
                    <img
                      src={tpl.image}
                      alt={tpl.name}
                      className="w-auto h-auto max-h-96 mx-auto"
                    />

                    {/* Download button */}
                    <button
                      onClick={() => {
                        const link = document.createElement("a");
                        link.href = tpl.image;
                        link.download = `${tpl.name}.png`;
                        link.click();

                        //post to record
                        fetch(`${import.meta.env.VITE_API_URL}/api/records`, {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify({
                            name: tpl.id,
                          }),
                        });

                      }}
                      className="absolute bottom-0 left-0 bg-black dark:bg-white text-white dark:text-black p-2 hover:bg-black/70 dark:hover:bg-white/80 border-black dark:border-white transition-colors"
                    >
                      <ArrowDownToLine size={24} />
                    </button>
                  </div>
                </Card>
              ))}
        </div>

        {/* Pagination */}
        <Pagination className="mt-4 -mb-6">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "font-crimson text-lg"
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                onClick={() => {
                  if (templates[currentPage + 1]?.length > 0) {
                    setCurrentPage((p) => p + 1);
                  }
                }}
                className={
                  !templates[currentPage + 1] ||
                  templates[currentPage + 1]?.length === 0
                    ? "pointer-events-none opacity-50"
                    : "font-crimson text-lg"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
