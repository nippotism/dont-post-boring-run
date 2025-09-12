import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageCanvas } from "./image-canvas";

import type { ActivityData, templateType } from "@/types/strava";

interface TemplatePreviewProps {
  activity: ActivityData;
  template: templateType;
}

export function TemplatePreview({ activity, template }: TemplatePreviewProps) {
  const [imageData, setImageData] = useState<string | null>(null);

  return (
    <div className="relative group w-full max-w-sm mx-auto">
      {/* Canvas */}
      <ImageCanvas
        activity={activity}
        template={template}
        onImageReady={setImageData}
      />

      {/* Download button overlay */}
      {imageData && (
        <a
          href={imageData}
          download={`strava-post-${template}.png`}
          className="
            absolute inset-0 flex items-center justify-center
            opacity-0 group-hover:opacity-100 z-50 transition-opacity
          "
        >
          <Button>Download</Button>
        </a>
      )}

      {/* Blur effect on hover */}
      <div
        className="
          absolute inset-0 bg-transparent
          group-hover:backdrop-blur-xs
          transition-all rounded-lg
        "
      />

      {/* Template label */}
      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
        {template}
      </div>
    </div>
  );
}
