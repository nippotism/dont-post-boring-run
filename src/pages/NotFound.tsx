import { useLocation, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import FuzzyText from "@/components/ui/FuzzyText";

const NotFound = () => {
  const location = useLocation();


  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: "url('/images/bg6.jpg')",
      }}
    >
      <div />

      <div className="container mx-auto flex flex-col items-center justify-center h-screen px-6 py-8">
        <FuzzyText  
          fontSize={120}
          >
          404
        </FuzzyText> 
        <FuzzyText  
          fontSize={120}
          >
          404
        </FuzzyText> 
        <FuzzyText  
          fontSize={120}
          >
          404
        </FuzzyText> <FuzzyText  
          fontSize={120}
          >
          404
        </FuzzyText> 
        <button
          onClick={() => (window.location.href = "/")}
          className="mt-10 py-1 px-3 font-crimson transition text-sm bg-white flex items-center gap-1 hover:bg-gray-200 hover:border-black border border-transparent text-black"
        >

          <ArrowLeft strokeWidth={1} /> GO HOME
        </button>
      </div>
    </div>
  );
};

export default NotFound;
