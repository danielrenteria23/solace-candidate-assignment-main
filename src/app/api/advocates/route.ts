import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function GET() {
  const data = await db.select().from(advocates);

  // Uncomment this line to use static data
  // const data = advocateData;

  return Response.json({ data });
}
