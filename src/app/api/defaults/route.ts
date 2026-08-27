import { NextResponse } from "next/server";

const defaults = {
  player1Name: "Adams",
  player2Name: "Cole",
  player3Name: "Karr",
  player4Name: "Miller",
  courseName: "Victoria"
};

export async function GET() {
  return NextResponse.json(defaults);
}