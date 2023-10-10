import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/session";
import prismadb from "@/lib/db";
import { userSettingSchema } from "@/lib/validations/user";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { userId: string } },
) {
  const user = await getCurrentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  const data = userSettingSchema.parse(body);

  await prismadb.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: data.username,
    },
  });

  return new NextResponse("Success", { status: 200 });
}
