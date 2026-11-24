import { NextResponse } from "next/server";
import { DataError, loadGreenhouse } from "@/data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await loadGreenhouse());
  } catch (error) {
    const message = error instanceof DataError ? error.message : "The database did not answer.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
