import CubeViewer from "@/components/CubeViewer";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function CubePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return <CubeViewer />;
}
