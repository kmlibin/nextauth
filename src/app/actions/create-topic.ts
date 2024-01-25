"use server";

import { z } from "zod";
import { auth } from "@/auth";
import type { Topic } from "@prisma/client";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import paths from "@/paths";

//create an object for zod validation
const createTopicSchema = z.object({
  name: z
    .string()
    .min(3)
    .regex(/^[a-z-]+$/, { message: "no spaces or uppercase plzzzz" }),
  description: z.string().min(10),
});

//form is for generic errors
interface CreateTopicFormState {
  errors: {
    name?: string[];
    description?: string[];
    _form?: string[];
  };
}

export async function createTopic(
  formState: CreateTopicFormState,
  formData: FormData
): Promise<CreateTopicFormState> {
  //todo:
  //revalidate the homepage after creating a topic

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
  //check if user is logged in
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be signed in to complete function"],
      },
    };
  }

  //declare this because we need the topic id for redirect. remember, redirect works by throwing an error, 
  //so redirect needs to be outside the block because after an error is thrown, nothing else runs

  let topic: Topic;
  //result comes from what we got thru safeParse
  try {
    topic = await db.topic.create({
      data: {
        slug: result.data.name,
        description: result.data.description,
      },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        errors: {
          _form: [error.message],
        },
      };
    } else {
      return {
        errors: {
          _form: ["Something went wrong..."],
        },
      };
    }
  }

  revalidatePath('/')
  redirect(paths.topicShowPath(topic.slug));
  //not an error, but we are returning a type that matches the interface

}
