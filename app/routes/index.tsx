import * as Form from "@radix-ui/react-form";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useRef } from "react";
import { z } from "zod";
import { transformFieldErrors } from "~/utils/form";
import { useServerErrors } from "~/utils/use-server-errors";

const FormSchema = z.object({
  email: z.string().email(),
  question: z.string().trim().min(5, "At least 5 characters").max(10, "Max 10"),
});

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const result = await FormSchema.safeParseAsync(
    Object.fromEntries(formData.entries())
  );

  if (!result.success) {
    return json({
      success: false,
      errors: transformFieldErrors<typeof FormSchema>(result.error),
    });
  }

  return json({ success: true, errors: null });
}

export default function Index() {
  const formRef = useRef<HTMLFormElement>(null);
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const { serverErrors, setServerErrors, clearServerErrors, clearServerError } =
    useServerErrors<typeof FormSchema>({
      email: undefined,
      question: undefined,
    });

  const isSubmitting =
    navigation.state === "submitting" && navigation.formMethod === "post";

  useEffect(() => {
    if (actionData?.errors) {
      setServerErrors(actionData.errors);
    }
  }, [actionData?.errors, setServerErrors]);

  useEffect(() => {
    if (!isSubmitting && !actionData?.errors) {
      formRef.current?.reset();
    }
  }, [actionData?.errors, isSubmitting]);

  return (
    <div className="bg-gradient-to-b from-indigo-500 to-purple-500 flex justify-center h-screen items-center">
      <Form.Root
        className="w-[260px]"
        asChild
        onClearServerErrors={clearServerErrors}
      >
        <RemixForm ref={formRef} method="post">
          <Form.Field
            className="grid mb-[10px]"
            name="email"
            serverInvalid={!!serverErrors.email}
          >
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                Email
              </Form.Label>
              <Form.Message
                className="text-[13px] text-white opacity-[0.8]"
                match="valueMissing"
              >
                Please enter your email
              </Form.Message>
              <Form.Message
                className="text-[13px] text-white opacity-[0.8]"
                match="typeMismatch"
                forceMatch={!!serverErrors.email}
              >
                Please provide a valid email
              </Form.Message>
            </div>
            <Form.Control
              className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9"
              type="email"
              required
              autoComplete="off"
            />
          </Form.Field>
          <Form.Field
            className="grid mb-[10px]"
            name="question"
            serverInvalid={!!serverErrors.question}
          >
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                Question
              </Form.Label>
              <Form.Message
                className="text-[13px] text-white opacity-[0.8]"
                match="valueMissing"
              >
                Please enter a question
              </Form.Message>

              {serverErrors.question && (
                <Form.Message className="text-[13px] text-white opacity-[0.8]">
                  {serverErrors.question}
                </Form.Message>
              )}
            </div>

            <Form.Control asChild>
              <textarea
                className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9 resize-none"
                required
                onChange={() => clearServerError("question")}
              />
            </Form.Control>
          </Form.Field>
          <Form.Submit asChild>
            <button className="box-border w-full text-violet11 shadow-blackA7 hover:bg-mauve3 inline-flex h-[35px] items-center justify-center rounded-[4px] bg-white px-[15px] font-medium leading-none shadow-[0_2px_10px] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none mt-[10px]">
              {isSubmitting ? "Posting question..." : "Post question"}
            </button>
          </Form.Submit>
        </RemixForm>
      </Form.Root>
    </div>
  );
}

// Requires zod client side
// function CustomMessage<T extends z.AnyZodObject>({
//   name,
//   schema,
// }: {
//   name: keyof T["shape"];
//   schema: T;
// }) {
//   const [message, setMessage] = useState<string | null>(null);

//   return (
//     <Form.Message
//       className="text-[13px] text-white opacity-[0.8]"
//       match={async (value) => {
//         const parse = await schema.shape[name].safeParseAsync(value);

//         if (parse.success) return false;

//         setMessage(parse.error.issues[0].message);

//         return true;
//       }}
//     >
//       {message}
//     </Form.Message>
//   );
// }
