import { useState } from "react";
import type { z } from "zod";
import type { FormServerErrors } from "./form.server";

export function useServerErrors<
  Schema extends z.AnyZodObject,
  ServerErrors = FormServerErrors<Schema>
>(defaultValue: ServerErrors) {
  const [serverErrors, setServerErrors] = useState<ServerErrors>(defaultValue);
  const clearServerErrors = () => setServerErrors(defaultValue);
  const clearServerError = (name: keyof ServerErrors) =>
    setServerErrors((prev) => ({ ...prev, [name]: undefined }));

  return { serverErrors, setServerErrors, clearServerErrors, clearServerError };
}
