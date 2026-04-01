export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskEntity = {
  id: number;
  columnId: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  createdAt: string;
  updatedAt: string;
};

export type ColumnEntity = {
  id: number;
  boardId: number;
  name: string;
  displayOrder: number;
  createdAt: string;
  tasks: TaskEntity[];
};

export type BoardEntity = {
  id: number;
  name: string;
  createdAt: string;
  columns: ColumnEntity[];
};

export type ApiSuccess<T> = {
  success: true;
  data: T;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;
