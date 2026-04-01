"use client";

import { useState } from "react";
import { ColumnEntity } from "@/lib/types";
import { TaskModal } from "@/components/kanban/task-modal";
import { TaskCard } from "@/components/kanban/task-card";

type ColumnLaneProps = {
  column: ColumnEntity;
  columnsForMove: Array<{ id: number; name: string }>;
  onTaskMutation: () => Promise<void>;
};

export function ColumnLane({
  column,
  columnsForMove,
  onTaskMutation,
}: ColumnLaneProps) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <section className="w-[340px] min-w-[340px] rounded-3xl border border-[var(--border-base)] bg-[var(--surface-1)] p-4">
      <header className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">
          {column.name}{" "}
          <span className="text-base font-medium text-[var(--text-tertiary)]">
            ({column.tasks.length})
          </span>
        </h3>
        <button
          type="button"
          onClick={() => setIsTaskModalOpen(true)}
          className="h-8 w-8 rounded-full border border-[var(--border-soft)] text-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface-2)]"
          aria-label="Agregar tarea"
        >
          +
        </button>
      </header>

      {column.tasks.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-2)] px-3 py-6 text-center text-sm text-[var(--text-tertiary)]">
          Sin tareas. Agrega la primera tarjeta.
        </div>
      ) : (
        <div className="space-y-3">
          {column.tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              columns={columnsForMove}
              onMutate={onTaskMutation}
            />
          ))}
        </div>
      )}

      {isTaskModalOpen ? (
        <TaskModal
          columnId={column.id}
          onCreated={onTaskMutation}
          onClose={() => setIsTaskModalOpen(false)}
        />
      ) : null}
    </section>
  );
}
