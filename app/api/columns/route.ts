import { db } from "@/lib/db";
import { HttpError, toApiError } from "@/lib/errors";
import { fail, ok } from "@/lib/api-response";
import { createColumnSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createColumnSchema.parse(body);

    const board = await db.board.findUnique({
      where: { id: payload.boardId },
      select: { id: true },
    });

    if (!board) {
      throw new HttpError(404, "BOARD_NOT_FOUND", "Board not found.");
    }

    const existsInOrder = await db.column.findFirst({
      where: {
        boardId: payload.boardId,
        displayOrder: payload.displayOrder,
      },
      select: { id: true },
    });

    if (existsInOrder) {
      throw new HttpError(
        409,
        "COLUMN_ORDER_CONFLICT",
        "displayOrder already exists in this board.",
      );
    }

    const column = await db.column.create({
      data: payload,
    });

    return ok(column, 201);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}
