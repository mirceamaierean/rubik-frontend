import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cubes = await prisma.cube.findMany({
    where: {
      userId: user.id,
    },
  });

  return NextResponse.json(cubes);
}

// POST /api/cube - Create a new cube
export async function POST(request: NextRequest) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const { description, scramble } = body;

    // Create the new cube
    const newCube = await prisma.cube.create({
      data: {
        userId: user.id,
        description,
        scramble,
      },
    });

    return NextResponse.json(newCube, { status: 201 });
  } catch (error) {
    console.error("Error creating cube:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
