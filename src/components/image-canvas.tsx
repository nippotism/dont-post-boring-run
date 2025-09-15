import { useEffect, useRef } from "react";
import type { ActivityData, templateType } from "@/types/strava";
import { decodePolyline, drawPolyline, PaceCounter, timeConverter } from "@/hooks/logic";

interface ImageCanvasProps {
  activity: ActivityData | null;
  template: templateType;
  onImageReady: (dataUrl: string) => void;
}

// Different logical sizes per template
const TEMPLATE_SIZES = {
  Classic: [800, 800],
  Minimal: [800, 800],
  Modern: [800, 800],
  Elegant: [800, 800],
  Elegant2: [800, 800],

};

const PREVIEW_SIZE = 360; // CSS preview size

export function ImageCanvas({ activity, template, onImageReady }: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!activity) return;

    console.log(activity);

    const act = { ...activity };
    act.pace = PaceCounter(act.moving_time, act.distance);
    act.distance = Number((act.distance / 1000).toFixed(2));
    act.polyline = act.map?.summary_polyline
      ? decodePolyline(act.map.summary_polyline)
      : [];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [LOGICAL_W, LOGICAL_H] = TEMPLATE_SIZES[template] ?? [800, 800];

    // High res
    const dpr = window.devicePixelRatio || 1;
    canvas.width = LOGICAL_W * dpr;
    canvas.height = LOGICAL_H * dpr;

    // Preview
    canvas.style.width = PREVIEW_SIZE + "px";
    canvas.style.height = (PREVIEW_SIZE * LOGICAL_H) / LOGICAL_W + "px";

    ctx.scale(dpr, dpr);

    document.fonts.ready.then(() => {
      ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);

      switch (template) {
        case "Minimal":
          drawMinimal(ctx, act, LOGICAL_W, LOGICAL_H);
          break;
        case "Modern":
          drawModern(ctx, act, LOGICAL_W, LOGICAL_H);
          break;
        case "Elegant":
          drawElegant(ctx, act, LOGICAL_W, LOGICAL_H);
          break;
        case "Elegant2":
          drawElegant2(ctx, act, LOGICAL_W, LOGICAL_H);
          break;
        default:
          drawClassic(ctx, act, LOGICAL_W, LOGICAL_H);
      }

      onImageReady(canvas.toDataURL("image/png"));
    });
  }, [activity, template, onImageReady]);

  return <canvas ref={canvasRef} className="w-full border rounded-lg" />;
}

/* ===========================
   Template functions
=========================== */

function drawClassic(ctx: CanvasRenderingContext2D, activity: ActivityData, width: number, height: number) {
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.font = "48px Times New Roman, serif";
  ctx.fillText(`${activity.distance} km, ${activity.pace} min/km.`, width / 2, height / 2 - 20);

}

function drawMinimal(ctx: CanvasRenderingContext2D, activity: ActivityData, width: number, height: number) {
  ctx.textAlign = "center";

  ctx.fillStyle = "#ff8d21";
  ctx.font = "bold italic 48px Times New Roman, serif";
  ctx.fillText(`"${activity.name}"`, width / 2, height / 2 +25);
  
  ctx.fillStyle = "#000000";
  ctx.font = "bold italic 48px Times New Roman, serif ";
  ctx.strokeText(`"${activity.name}"`, width / 2, height / 2 +25);
  
  ctx.fillStyle = "#ff8d21";
  ctx.font = "bold italic 28px Arial";
  ctx.fillText(
    `${activity.distance} km, ${activity.pace} min/km.`,
    width / 2,
    height / 2 + 70
  );

  drawPolyline(ctx, activity.polyline ?? [], ctx.canvas, {
    x: width / 2 - 110,
    y: 180,
    w: 220,
    h: 150,
    color: "#ff8d21",
    lineWidth: 2,
  });
}

function drawModern(ctx: CanvasRenderingContext2D, activity: ActivityData, width: number, height: number) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const columnSpacing = 200; // horizontal space between stats
  const startX = width / 2 - columnSpacing; // leftmost column
  const centerY = height / 2;

  // Labels
  ctx.font = "italic 24px DM Mono, monospace";
  ctx.fillText("Distance", startX-10, centerY - 20);
  ctx.fillText("Pace", startX + columnSpacing, centerY - 20);
  ctx.fillText("Time", startX + columnSpacing * 2.1, centerY - 20);

  // Values
  ctx.font = "bold 30px DM Mono, monospace";
  ctx.fillText(`${activity.distance} km`, startX-10 , centerY + 20);
  ctx.fillText(`${activity.pace} min/km`, startX + columnSpacing, centerY + 20);
  ctx.fillText(`${timeConverter(activity.moving_time)}`, startX + columnSpacing * 2.1, centerY + 20);

  // Draw vertical lines between columns
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;

  // Between Distance and Pace
  ctx.beginPath();
  ctx.moveTo(startX + columnSpacing / 2.5, centerY - 40);
  ctx.lineTo(startX + columnSpacing / 2.5, centerY + 40);
  ctx.stroke();

  // Between Pace and Time
  ctx.beginPath();
  ctx.moveTo(startX + columnSpacing * 1.6, centerY - 40);
  ctx.lineTo(startX + columnSpacing * 1.6, centerY + 40);
  ctx.stroke();

  // Draw polyline below the stats
  drawPolyline(ctx, activity.polyline ?? [], ctx.canvas, {
    x: width / 2 - 110,
    y: centerY -230, // slightly below values
    w: 220,
    h: 150,
    color: "#ffffff",
    lineWidth: 3,
    style: "smooth",
    dash: [6, 4],
  });

  
}



function drawElegant(ctx: CanvasRenderingContext2D, activity: ActivityData, width: number, height: number) {
  ctx.textAlign = "center";

  ctx.font = "italic 48px Quintessential";  
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Distance", width / 2, 80);
  ctx.font = "italic 30px Quintessential";
  ctx.fillText(`${activity.distance} km`, width / 2, 120);

  ctx.font = "italic 48px Quintessential";
  ctx.fillText("Pace", width / 2, 200);
  ctx.font = "italic 30px Quintessential";
  ctx.fillText(`${activity.pace} min/km`, width / 2, 240);

  ctx.font = "italic 48px Quintessential";
  ctx.fillText("Time", width / 2, 320);
  ctx.font = "italic 30px Quintessential";
  ctx.fillText(`${timeConverter(activity.moving_time)}`, width / 2, 360);

  drawPolyline(ctx, activity.polyline ?? [], ctx.canvas, {
    x: width / 2 - 75,
    y: 410,
    w: 150,
    h: 150,
    color: "#ffffff",
    lineWidth: 3,
    style: "smooth"
  });

  ctx.font = "bold 18px Arial";
  ctx.fillStyle = "#666";
  ctx.fillText("dontpostboringrun.com", width / 2, height - 120);
}

function drawElegant2(ctx: CanvasRenderingContext2D, activity: ActivityData, width: number, height: number) {


  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  

  const headerHeight = 50;
  const titleHeight = 60;
  const statsLabelHeight = 40;
  const statsValueHeight = 60;
  const statsGap = 10;
  const footerHeight = 30;
  const totalContentHeight =
    headerHeight +
    titleHeight +
    statsLabelHeight +
    statsValueHeight +
    statsGap +
    footerHeight;

  const startY = (height - totalContentHeight) / 2;

  // Header (date)
  ctx.font = "28px Quintessential";
  ctx.fillText(
    new Date(activity.start_date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }),
    width / 2,
    startY + headerHeight / 2 -25
  );

  // Title
  ctx.font = "bold 56px Quintessential";
  ctx.fillText(
    activity.name || "Evening Walk",
    width / 2,
    startY + headerHeight + titleHeight / 2 -15
  );

  // Stats row
  const colX = [width / 4, width / 2, (3 * width) / 4];
  const labels = ["Distance", "Pace", "Time"];
  const values = [
    `${activity.distance.toFixed(1)} km`,
    `${activity.pace} /km`,
    timeConverter(activity.moving_time),
  ];

  // Labels
  ctx.font = "36px Quintessential";
  labels.forEach((l, i) =>
    ctx.fillText(
      l,
      colX[i],
      startY + headerHeight + titleHeight + statsLabelHeight / 2
    )
  );

  // Values
  ctx.font = "42px Quintessential";
  values.forEach((v, i) =>
    ctx.fillText(
      v,
      colX[i],
      startY +
        headerHeight +
        titleHeight +
        statsLabelHeight +
        statsValueHeight / 2 +
        statsGap
    )
  );

  // Footer
  ctx.font = "16px Arial";
  ctx.fillStyle = "#aaa";
  ctx.fillText(
    "dontpostboringrun.com",
    width / 2,
    startY +
      headerHeight +
      titleHeight +
      statsLabelHeight +
      statsValueHeight +
      statsGap +
      footerHeight
  );
}

