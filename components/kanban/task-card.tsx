"use client";

import { FormEvent, useState } from "react";
import { TaskEntity } from "@/lib/types";
import { MoveTaskSelect } from "@/components/kanban/move-task-select";

type TaskCardProps = {
  task: TaskEntity;
  columns: Array<{ id: number; name: string }>;
  onMutate: () => Promise<void>;
};

const priorityStyles: Record<TaskEntity["priority"], string> = {
  LOW: "bg-emerald-50 text-emerald-700 border-emerald-200",
  MEDIUM: "bg-amber-50 text-amber-700 border-amber-200",
  HIGH: "bg-rose-50 text-rose-700 border-rose-200",
};

const priorityLabel: Record<TaskEntity["priority"], string> = {
  LOW: "Baja",
  MEDIUM: "Media",
  HIGH: "Alta",
};

export function TaskCard({ task, columns, onMutate }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isBusy, setIsBusy] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description ?? "");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function moveTask(columnId: number) {
    if (columnId === task.columnId) return;

    setIsBusy(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ columnId }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "No se pudo mover la tarea.");
      }
      await onMutate();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al mover tarea.";
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  async function deleteTask() {
    setIsBusy(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "DELETE",
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "No se pudo borrar la tarea.");
      }
      await onMutate();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al borrar tarea.";
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  async function updateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsBusy(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "No se pudo editar la tarea.");
      }
      setIsEditing(false);
      await onMutate();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al editar tarea.";
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <article className="rounded-2xl border border-[var(--border-base)] bg-[var(--surface-2)] p-4 shadow-[0_7px_20px_rgba(15,23,42,0.06)]">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span
          className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${priorityStyles[task.priority]}`}
        >
          {priorityLabel[task.priority]}
        </span>
        <button
          type="button"
          onClick={() => setIsEditing((current) => !current)}
          className="text-xs font-medium text-[var(--text-tertiary)] transition hover:text-[var(--text-secondary)]"
        >
          {isEditing ? "Cerrar" : "Editar"}
        </button>
      </div>

      {isEditing ? (
        <form className="space-y-2" onSubmit={updateTask}>
          <input
            value={title}
            maxLength={140}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-lg border border-[var(--border-soft)] bg-[var(--control-bg)] px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none"
            required
          />
          <textarea
            value={description}
            rows={3}
            maxLength={2000}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full resize-none rounded-lg border border-[var(--border-soft)] bg-[var(--control-bg)] px-2.5 py-1.5 text-sm text-[var(--text-secondary)] outline-none"
          />
          <button
            type="submit"
            disabled={isBusy}
            className="rounded-lg bg-[var(--brand-main)] px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
          >
            Guardar cambios
          </button>
        </form>
      ) : (
        <>
          <h4 className="text-[15px] font-semibold leading-5 text-[var(--text-primary)]">
            {task.title}
          </h4>
          <p className="mt-2 min-h-8 text-sm leading-5 text-[var(--text-tertiary)]">
            {task.description || "Sin descripción"}
          </p>
        </>
      )}

      <div className="mt-4 flex items-center justify-between gap-2">
        <MoveTaskSelect
          value={task.columnId}
          options={columns}
          disabled={isBusy}
          onChange={moveTask}
        />
        <button
          type="button"
          disabled={isBusy}
          onClick={deleteTask}
          className="rounded-lg border border-rose-200 px-2 py-1 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
        >
          Eliminar
        </button>
      </div>

      {errorMessage ? (
        <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1.5 text-xs text-rose-700">
          {errorMessage}
        </p>
      ) : null}
    </article>
  );
}
