"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { BoardEntity, ApiResponse } from "@/lib/types";
import { ColumnLane } from "@/components/kanban/column-lane";

type BoardViewProps = {
  boardId: number;
};

export function BoardView({ boardId }: BoardViewProps) {
  const [board, setBoard] = useState<BoardEntity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [columnName, setColumnName] = useState("");
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);

  const loadBoard = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`/api/boards/${boardId}`, { cache: "no-store" });
      const payload: ApiResponse<BoardEntity> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(
          !payload.success
            ? payload.error.message
            : "No se pudo cargar la información del board.",
        );
      }
      setBoard(payload.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al cargar board.";
      setErrorMessage(message);
      setBoard(null);
    } finally {
      setIsLoading(false);
    }
  }, [boardId]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const moveOptions = useMemo(
    () => board?.columns.map((column) => ({ id: column.id, name: column.name })) ?? [],
    [board],
  );

  async function createColumn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!board) return;

    setIsCreatingColumn(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/columns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          boardId: board.id,
          name: columnName,
          displayOrder: board.columns.length,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(payload.error?.message ?? "No se pudo crear la columna.");
      }
      setColumnName("");
      await loadBoard();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al crear columna.";
      setErrorMessage(message);
    } finally {
      setIsCreatingColumn(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-[var(--border-base)] bg-[var(--surface-1)] p-10 text-center text-sm text-[var(--text-tertiary)]">
        Cargando tablero...
      </div>
    );
  }

  if (errorMessage && !board) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {errorMessage}
      </div>
    );
  }

  if (!board) {
    return (
      <div className="rounded-2xl border border-[var(--border-base)] bg-[var(--surface-1)] p-10 text-center text-sm text-[var(--text-tertiary)]">
        Board no encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-[var(--border-base)] bg-[var(--surface-1)] p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
              {board.name}
            </h1>
            <p className="text-sm text-[var(--text-tertiary)]">
              Vista Kanban operativa
            </p>
          </div>
          <button
            type="button"
            className="rounded-xl bg-[var(--brand-main)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-main-strong)]"
          >
            Export Data
          </button>
        </div>

        <div className="mt-4 inline-flex rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] p-1 text-sm">
          <span className="rounded-lg bg-white px-3 py-1 font-medium text-[var(--text-secondary)]">
            Column View
          </span>
          <span className="px-3 py-1 text-[var(--text-tertiary)]">List View</span>
          <span className="px-3 py-1 text-[var(--text-tertiary)]">Grid View</span>
        </div>
      </header>

      <form
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-[var(--border-base)] bg-[var(--surface-1)] p-3"
        onSubmit={createColumn}
      >
        <input
          required
          value={columnName}
          maxLength={80}
          onChange={(event) => setColumnName(event.target.value)}
          placeholder="Nombre de columna (ej: In Progress)"
          className="min-w-64 flex-1 rounded-xl border border-[var(--border-soft)] bg-[var(--control-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)]"
        />
        <button
          type="submit"
          disabled={isCreatingColumn}
          className="rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-1)] disabled:opacity-60"
        >
          {isCreatingColumn ? "Creando..." : "Agregar columna"}
        </button>
      </form>

      {errorMessage ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {errorMessage}
        </div>
      ) : null}

      {board.columns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--border-soft)] bg-[var(--surface-1)] p-8 text-center text-sm text-[var(--text-tertiary)]">
          Este board no tiene columnas. Agrega la primera para empezar.
        </div>
      ) : (
        <div className="overflow-x-auto pb-3">
          <div className="flex min-w-max gap-4">
            {board.columns.map((column) => (
              <ColumnLane
                key={column.id}
                column={column}
                columnsForMove={moveOptions}
                onTaskMutation={loadBoard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
