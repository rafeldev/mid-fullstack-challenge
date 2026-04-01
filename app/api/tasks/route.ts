import { db } from "@/lib/db";
import { HttpError, toApiError } from "@/lib/errors";
import { fail, ok } from "@/lib/api-response";
import { createTaskSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = createTaskSchema.parse(body);

    const column = await db.column.findUnique({
      where: { id: payload.columnId },
      select: { id: true },
    });

    if (!column) {
      throw new HttpError(404, "COLUMN_NOT_FOUND", "Column not found.");
    }

    const task = await db.task.create({
      data: {
        columnId: payload.columnId,
        title: payload.title,
        description: payload.description || null,
        priority: payload.priority,
      },
    });

    return ok(task, 201);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}
