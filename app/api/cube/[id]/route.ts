import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/session";
import prisma from "@/lib/prisma";

// GET /api/cube/[id] - Get a specific cube by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cube = await prisma.cube.findFirst({
      where: {
        id: params.id,
        userId: user.id, // Ensure user can only access their own cubes
      },
    });

    if (!cube) {
      return NextResponse.json({ error: "Cube not found" }, { status: 404 });
    }

    return NextResponse.json(cube);
  } catch (error) {
    console.error("Error fetching cube:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// DELETE /api/cube/[id] - Delete a specific cube by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const user = await getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // First check if the cube exists and belongs to the user
    const cube = await prisma.cube.findFirst({
      where: {
        id: params.id,
        userId: user.id,
      },
    });

    if (!cube) {
      return NextResponse.json({ error: "Cube not found" }, { status: 404 });
    }

    // Delete the cube
    await prisma.cube.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json(
      { message: "Cube deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting cube:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
