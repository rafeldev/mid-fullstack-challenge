import { Priority } from "@prisma/client";
import { z } from "zod";

const nameSchema = z.string().trim().min(1).max(80);
const descriptionSchema = z.string().trim().max(2000);

export const createBoardSchema = z.object({
  name: nameSchema,
});

export const boardIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const createColumnSchema = z.object({
  boardId: z.coerce.number().int().positive(),
  name: nameSchema,
  displayOrder: z.coerce.number().int().nonnegative(),
});

export const createTaskSchema = z.object({
  columnId: z.coerce.number().int().positive(),
  title: z.string().trim().min(1).max(140),
  description: descriptionSchema.optional().or(z.literal("")),
  priority: z.nativeEnum(Priority).default(Priority.MEDIUM),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(140).optional(),
    description: descriptionSchema.optional().or(z.literal("")),
    priority: z.nativeEnum(Priority).optional(),
    columnId: z.coerce.number().int().positive().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required to update a task.",
  });

export const taskIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});
