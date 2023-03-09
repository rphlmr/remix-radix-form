import type { z } from "zod";

export type FormServerErrors<S extends z.AnyZodObject> = Partial<
  Record<keyof z.infer<S>, string | undefined>
>;

export function transformFieldErrors<S extends z.AnyZodObject>(
  error: z.ZodError<z.infer<S>>
) {
  return Object.entries(error.formErrors.fieldErrors).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: (value as string[] | undefined)?.[0],
    }),
    {} as FormServerErrors<S>
  );
}
