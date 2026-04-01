import { db } from "@/lib/db";
import { HttpError, toApiError } from "@/lib/errors";
import { fail, ok } from "@/lib/api-response";
import { taskIdSchema, updateTaskSchema } from "@/lib/validation";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = taskIdSchema.parse(await params);
    const body = await request.json();
    const payload = updateTaskSchema.parse(body);

    const existingTask = await db.task.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingTask) {
      throw new HttpError(404, "TASK_NOT_FOUND", "Task not found.");
    }

    if (payload.columnId) {
      const targetColumn = await db.column.findUnique({
        where: { id: payload.columnId },
        select: { id: true },
      });

      if (!targetColumn) {
        throw new HttpError(404, "COLUMN_NOT_FOUND", "Target column not found.");
      }
    }

    const task = await db.task.update({
      where: { id },
      data: {
        title: payload.title,
        description:
          payload.description !== undefined
            ? payload.description || null
            : undefined,
        priority: payload.priority,
        columnId: payload.columnId,
      },
    });

    return ok(task);
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = taskIdSchema.parse(await params);

    const existingTask = await db.task.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!existingTask) {
      throw new HttpError(404, "TASK_NOT_FOUND", "Task not found.");
    }

    await db.task.delete({ where: { id } });
    return ok({ id });
  } catch (error) {
    const apiError = toApiError(error);
    return fail(apiError, apiError.status);
  }
}
