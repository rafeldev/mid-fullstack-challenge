type ApiErrorPayload = {
  code: string;
  message: string;
  details?: unknown;
};

export function ok<T>(data: T, status = 200): Response {
  return Response.json({ success: true, data }, { status });
}

export function fail(error: ApiErrorPayload, status = 400): Response {
  return Response.json(
    {
      success: false,
      error,
    },
    { status },
  );
}
