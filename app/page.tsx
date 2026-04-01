"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { ApiResponse } from "@/lib/types";

type BoardListItem = {
  id: number;
  name: string;
  createdAt: string;
  _count: {
    columns: number;
  };
};

export default function HomePage() {
  const router = useRouter();
  const [boards, setBoards] = useState<BoardListItem[]>([]);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadBoards() {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await fetch("/api/boards", { cache: "no-store" });
      const payload: ApiResponse<BoardListItem[]> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(
          !payload.success
            ? payload.error.message
            : "No se pudieron cargar los boards.",
        );
      }
      setBoards(payload.data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al cargar.";
      setErrorMessage(message);
      setBoards([]);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadBoards();
  }, []);

  async function createBoard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const payload: ApiResponse<BoardListItem> = await response.json();
      if (!response.ok || !payload.success) {
        throw new Error(
          !payload.success ? payload.error.message : "No se pudo crear el board.",
        );
      }

      router.push(`/boards/${payload.data.id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error inesperado al crear board.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[1100px] flex-col px-6 py-8">
      <section className="rounded-3xl border border-[var(--border-base)] bg-[var(--surface-1)] p-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
          Project PlanetX
        </h1>
        <p className="mt-2 text-sm text-[var(--text-tertiary)]">
          Crea un board y gestiona tareas en vista Kanban.
        </p>
      </section>

      <section className="mt-5 rounded-3xl border border-[var(--border-base)] bg-[var(--surface-1)] p-6">
        <h2 className="mb-3 text-lg font-semibold text-[var(--text-primary)]">
          Crear board
        </h2>
        <form className="flex flex-wrap gap-2" onSubmit={createBoard}>
          <input
            required
            maxLength={80}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="min-w-72 flex-1 rounded-xl border border-[var(--border-soft)] bg-[var(--control-bg)] px-3 py-2 text-sm text-[var(--text-primary)] outline-none transition focus:border-[var(--border-strong)]"
            placeholder="Ej: Sprint Mobile App"
          />
          <button
            disabled={isSubmitting}
            className="rounded-xl bg-[var(--brand-main)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-main-strong)] disabled:opacity-60"
            type="submit"
          >
            {isSubmitting ? "Creando..." : "Crear"}
          </button>
        </form>
        {errorMessage ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </section>

      <section className="mt-5 rounded-3xl border border-[var(--border-base)] bg-[var(--surface-1)] p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Boards existentes
          </h2>
          <button
            type="button"
            onClick={() => void loadBoards()}
            className="text-sm font-medium text-[var(--text-tertiary)] transition hover:text-[var(--text-secondary)]"
          >
            Recargar
          </button>
        </div>

        {isLoading ? (
          <p className="text-sm text-[var(--text-tertiary)]">Cargando boards...</p>
        ) : boards.length === 0 ? (
          <p className="rounded-xl border border-dashed border-[var(--border-soft)] p-4 text-sm text-[var(--text-tertiary)]">
            Aun no hay boards. Crea el primero arriba.
          </p>
        ) : (
          <ul className="space-y-2">
            {boards.map((board) => (
              <li key={board.id}>
                <Link
                  href={`/boards/${board.id}`}
                  className="flex items-center justify-between rounded-xl border border-[var(--border-soft)] bg-[var(--surface-2)] px-4 py-3 transition hover:border-[var(--border-base)]"
                >
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{board.name}</p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {new Date(board.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-full border border-[var(--border-soft)] px-2 py-1 text-xs text-[var(--text-secondary)]">
                    {board._count.columns} columnas
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
