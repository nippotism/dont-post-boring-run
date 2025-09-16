import {useEffect, useState} from "react";
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
import { ArrowDownToLine } from "lucide-react";






export function ActivityTemplatePage() {
    const { id } = useParams();
    const [templates, setTemplates] = useState<ActivityTemplate[]>([]);
    const [tplLoading, setTplLoading] = useState(true);
    const AthleteId = localStorage.getItem("strava_athlete_id");

    if (!AthleteId) {
      window.location.href = "/";
    }

    useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/activities/${id}/templates?page=1&limit=8&athlete=${AthleteId}`
        );
        const data = await res.json();
        setTplLoading(false);
        setTemplates(data.templates || []);
      } catch (err) {
        console.error("Error fetching templates:", err);
      } finally {
        setTplLoading(false);
      }
    };

    fetchTemplates();
  }, [id]);




  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const templateShow = templates.slice(
    startIndex,
    startIndex + itemsPerPage
  );



  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/bg5.jpg')",
       backgroundPosition: "center 65%"
       }}
    >
      {/* Optional overlay to darken the background */}
      <div/>
      {/* Navbar */}
      <Navbar />

      {/* Activities */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-row justify-between items-center font-crimson mb-3 text-2xl">
            <Link to="/activities" className="hover:underline hover:text-gray-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
        </Link>
            <h2 className="
        ml-auto text-right 
        sm:mx-auto sm:text-center
      ">CHOOSE YOUR TEMPLATE</h2>
            <div></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-calsans">
        {tplLoading
            ? // 🔹 Show skeleton cards while fetching
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
                    : // 🔹 Show real activities when loaded
                    templateShow.map((tpl) => (
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
                            {/* Image */}
                            <img
                              src={tpl.image}
                              alt={tpl.name}
                              className="w-auto h-auto max-h-96 mx-auto"
                            />

                            {/* Download button fixed at bottom-left */}
                            <button
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = tpl.image; // base64 image
                                link.download = `${tpl.name}.png`;
                                link.click();
                              }}
                              className="absolute bottom-0 left-0 bg-black dark:bg-white text-white dark:text-black p-2 hover:bg-black/70 dark:hover:bg-white/80 border-black dark:border-white transition-colors"
                            >
                              <ArrowDownToLine size={24} />
                            </button>
                          </div>
                    </Card>

            ))}
        </div>
               <Pagination className="mt-4 -mb-6">
                    <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        className={
                            currentPage === 1 ? "pointer-events-none opacity-50" : "font-crimson text-lg"
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
                            : "font-crimson text-lg"
                        }
                        />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
      </div>
    </div>
  );
};


