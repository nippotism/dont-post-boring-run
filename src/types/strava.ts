export interface ActivityData {
  id: number;
  name: string;
  type: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  start_date: string;
  average_speed?: number;
  max_speed?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  suffer_score?: number;
  pace?: string;
  polyline?: [number, number][];
  map?: {
    summary_polyline: string;
  };
}

export interface StravaAthlete {
  id: number;
  firstname: string;
  lastname: string;
  profile: string;
  city: string;
  state: string;
  country: string;
}

export interface StravaAuthTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

//create for storing template name
export const TemplateName = [
  "Classic",
  "Minimal",
  "Modern",
  "Elegant",
  "Elegant2"
] as const;
export type templateType = (typeof TemplateName)[number];