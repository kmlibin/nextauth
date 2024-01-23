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

export async function createTopic(formData: FormData) {
  //todo:
  //revalidate the homepage after creating a topic

  //these are linked to the "name" prop in the input fields
  //   const name = formData.get("name");
  //   const description = formData.get("description");

  const result = createTopicSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
  });
}
