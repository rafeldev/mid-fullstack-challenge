import { db } from "@/lib/db";
import { HttpError, toApiError } from "@/lib/errors";
import { fail, ok } from "@/lib/api-response";
import { boardIdSchema } from "@/lib/validation";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = boardIdSchema.parse(await params);

    const board = await db.board.findUnique({
      where: { id },
      include: {
        columns: {
          orderBy: { displayOrder: "asc" },
          include: {
            tasks: {
              orderBy: { createdAt: "desc" },
            },
          },
        },
      },
    });

    if (!board) {
      throw new HttpError(404, "BOARD_NOT_FOUND", "Board not found.");
    }

    return ok(board);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}
