"use client";

import { FormEvent, useState } from "react";
import { TaskPriority } from "@/lib/types";

type TaskModalProps = {
  columnId: number;
  onClose: () => void;
  onCreated: () => Promise<void>;
};

export function TaskModal({ columnId, onClose, onCreated }: TaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("MEDIUM");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          columnId,
          title,
          description,
          priority,
        }),
      });

      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "No se pudo crear la tarea.");
      }

      await onCreated();
      onClose();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al crear tarea.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 px-4">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border-base)] bg-[var(--surface-2)] p-6 shadow-[0_16px_55px_rgba(15,23,42,0.18)]">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
            Nueva tarea
          </h3>
          <p className="text-sm text-[var(--text-tertiary)]">
            Crea una tarjeta para esta columna.
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
              Título
            </label>
            <input
              required
              maxLength={140}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--control-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)]"
              placeholder="Ej: Integrar endpoint de tareas"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
              Descripción
            </label>
            <textarea
              rows={4}
              maxLength={2000}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full resize-none rounded-xl border border-[var(--border-soft)] bg-[var(--control-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)]"
              placeholder="Notas clave para ejecutar la tarea"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium uppercase tracking-wide text-[var(--text-tertiary)]">
              Prioridad
            </label>
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as TaskPriority)}
              className="w-full rounded-xl border border-[var(--border-soft)] bg-[var(--control-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)]"
            >
              <option value="LOW">Baja</option>
              <option value="MEDIUM">Media</option>
              <option value="HIGH">Alta</option>
            </select>
          </div>

          {errorMessage ? (
            <p className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </p>
          ) : null}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[var(--border-soft)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--surface-1)]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[var(--brand-main)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-main-strong)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Creando..." : "Crear tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
