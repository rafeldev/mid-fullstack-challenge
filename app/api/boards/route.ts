import { db } from "@/lib/db";
import { toApiError } from "@/lib/errors";
import { fail, ok } from "@/lib/api-response";
import { createBoardSchema } from "@/lib/validation";

export async function GET() {
  try {
    const boards = await db.board.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { columns: true },
        },
      },
    });

    return ok(boards);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createBoardSchema.parse(body);

    const board = await db.board.create({
      data: {
        name: payload.name,
      },
    });

    return ok(board, 201);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}
