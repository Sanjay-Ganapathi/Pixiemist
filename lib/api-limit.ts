import { getCurrentUser } from "@/lib/session";
import { MAX_FREE_COUNT } from "@/constants";
import prismadb from "@/lib/db";

export const checkApiLimit = async () => {
  const user = await getCurrentUser();

  if (!user) return;

  const count = await prismadb.creation.count({
    where: {
      userId: user.id,
    },
  });

  if (count && count >= MAX_FREE_COUNT) {
    return false;
  } else {
    return true;
  }
};

export const getCreationCount = async () => {
  const user = await getCurrentUser();

  if (!user) return 0;

  const count = await prismadb.creation.count({
    where: {
      userId: user.id,
    },
  });

  if (count) return count;
  else return 0;
};
