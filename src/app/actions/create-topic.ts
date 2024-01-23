"use server";

import { z } from "zod";

//create an object for zod validation
const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, { message: "Must be lowercase letters" }),
  description: z.string().min(10),
});

interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  //todo:
  //revalidate the homepage after creating a topic

  //these are linked to the "name" prop in the input fields
  //   const name = formData.get("name");
  //   const description = formData.get("description");

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });

  //if there is an error, we want to return something back to frontend via use formstate hook
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
  //not an error, but we are returning a type that matches the interface
  return {
    errors: {},
  };
}
