function decodePolyline(str: string): [number, number][] {
  let index = 0,
    lat = 0,
    lng = 0,
    coordinates: [number, number][] = [];

  while (index < str.length) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = str.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    coordinates.push([lat / 1e5, lng / 1e5]);
  }

  return coordinates;
}

// Draw polyline scaled into a box
// types for options
// types for options
interface DrawPolylineOptions {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  lineWidth?: number;
  style?: "normal" | "smooth" | "maze";
  dash?: number[]; // e.g. [5, 5] → dash 5px, gap 5px
}

// Draw polyline scaled into a box
function drawPolyline(
  ctx: CanvasRenderingContext2D,
  points: [number, number][],
  canvas: HTMLCanvasElement,
  {
    x,
    y,
    w,
    h,
    color,
    lineWidth = 3,
    style = "normal",
    dash,
  }: DrawPolylineOptions
) {
  if (!points.length) return;

  const lats = points.map((p) => p[0]);
  const lngs = points.map((p) => p[1]);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  // Apply dashes if provided
  if (dash && dash.length) {
    ctx.setLineDash(dash);
  } else {
    ctx.setLineDash([]); // reset to solid
  }

  ctx.beginPath();

  const scaledPoints: [number, number][] = points.map(([lat, lng]) => {
    const px = x + ((lng - minLng) / (maxLng - minLng)) * w;
    const py = y + ((maxLat - lat) / (maxLat - minLat)) * h; // invert Y
    return [px, py];
  });

  if (style === "smooth") {
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
    for (let i = 1; i < scaledPoints.length - 1; i++) {
      const [xMid, yMid] = [
        (scaledPoints[i][0] + scaledPoints[i + 1][0]) / 2,
        (scaledPoints[i][1] + scaledPoints[i + 1][1]) / 2,
      ];
      ctx.quadraticCurveTo(
        scaledPoints[i][0],
        scaledPoints[i][1],
        xMid,
        yMid
      );
    }
    const last = scaledPoints[scaledPoints.length - 1];
    ctx.lineTo(last[0], last[1]);
  } else if (style === "maze") {
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
    for (let i = 1; i < scaledPoints.length; i++) {
      const [prevX, prevY] = scaledPoints[i - 1];
      const [currX, currY] = scaledPoints[i];
      ctx.lineTo(currX, prevY);
      ctx.lineTo(currX, currY);
    }
  } else {
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
    for (let i = 1; i < scaledPoints.length; i++) {
      ctx.lineTo(scaledPoints[i][0], scaledPoints[i][1]);
    }
  }

  ctx.stroke();
}



function timeConverter(seconds: number): string {

  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const sec = seconds % 60;

  return minutes < 60 ? `${minutes}min ${sec}s` : `${hours}h ${remainingMinutes}min`;
}

function PaceCounter(sec: number, distance: number): string {
    // pace = moving_time (s) / distance (m) * 1000 → seconds per km
    distance = distance /1000
    const paceInSeconds = sec / (distance);

    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.round(paceInSeconds % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export { decodePolyline, drawPolyline, timeConverter, PaceCounter };