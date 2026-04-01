import { notFound } from "next/navigation";
import { BoardView } from "@/components/kanban/board-view";

export default async function BoardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const boardId = Number(id);

  if (!Number.isInteger(boardId) || boardId <= 0) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1400px] px-6 py-8">
      <BoardView boardId={boardId} />
    </main>
  );
}
