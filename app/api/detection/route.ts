import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const formData = await req.formData();
  const response = await fetch(`${process.env.FLASK_URL}/detect`, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { "content-type": "application/json" },
  });
}
