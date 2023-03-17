import * as Form from "@radix-ui/react-form";
import type { ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Form as RemixForm,
  useActionData,
  useNavigation,
} from "@remix-run/react";
import { useEffect } from "react";
import { z } from "zod";

import { conform, useForm } from "@conform-to/react";
import { parse } from "@conform-to/zod";

const FormSchema = z.object({
  email: z.string().email("This is not an email"),
  question: z.string().trim().min(5, "At least 5 characters").max(10, "Max 10"),
});

export async function action({ request }: ActionArgs) {
  const formData = await request.formData();
  const submission = await parse(formData, {
    schema: FormSchema,
    async: true,
  });

  if (!submission.value) {
    return json({
      submission,
      success: false,
    });
  }

  console.log(submission.value);

  return json({ submission, success: true });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const [form, { email, question }] = useForm<z.infer<typeof FormSchema>>({
    lastSubmission: actionData?.submission,
    initialReport: "onBlur",
    onValidate({ formData }) {
      return parse(formData, { schema: FormSchema });
    },
  });
  const navigation = useNavigation();

  const isSubmitting =
    navigation.state === "submitting" && navigation.formMethod === "post";

  useEffect(() => {
    if (!isSubmitting && actionData?.success) {
      form.props.ref.current?.reset();
    }
  }, [form.props.ref, isSubmitting, actionData]);

  return (
    <div className="bg-gradient-to-b from-indigo-500 to-purple-500 flex justify-center h-screen items-center">
      <Form.Root className="w-[260px]" asChild>
        <RemixForm method="post" {...form.props}>
          <Form.Field
            className="grid mb-[10px]"
            {...conform.input(email, { type: "email" })}
          >
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                Email
              </Form.Label>

              {!!email.error && (
                <Form.Message className="text-[13px] text-white opacity-[0.8]">
                  {email.error}
                </Form.Message>
              )}
            </div>
            <Form.Control className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex h-[35px] appearance-none items-center justify-center rounded-[4px] px-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9" />
          </Form.Field>
          <Form.Field
            className="grid mb-[10px]"
            {...conform.textarea(question)}
          >
            <div className="flex items-baseline justify-between">
              <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                Question
              </Form.Label>
              {!!question.error && (
                <Form.Message className="text-[13px] text-white opacity-[0.8]">
                  {question.error}
                </Form.Message>
              )}
            </div>

            <Form.Control asChild>
              <textarea className="box-border w-full bg-blackA5 shadow-blackA9 inline-flex appearance-none items-center justify-center rounded-[4px] p-[10px] text-[15px] leading-none text-white shadow-[0_0_0_1px] outline-none hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black] selection:color-white selection:bg-blackA9 resize-none" />
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
