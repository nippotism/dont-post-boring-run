
import { Metadata } from "next";

export const dynamic = "force-dynamic"; // agar tidak dibuild statis

export const metadata: Metadata = {
  title: "DPBR - Template",
  description: "Choose your template for activity details.",
};

export default async function ActivityTemplateRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;
  return <div>Activity ID: {id}</div>;
}
