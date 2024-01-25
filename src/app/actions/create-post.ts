"use server";

import type { Post } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/db";
import paths from "@/paths";

//validation object for zod
const createPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
});

//interface what we will be returning from the createPost

interface CreatePostFormState {
  errors: {
    title?: string[];
    content?: string[];
    _form?: string[];
  };
}

//grab slug as well!
export async function createPost(
  slug: string,
  formState: CreatePostFormState,
  formData: FormData
): Promise<CreatePostFormState> {
  const result = createPostSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!result.success) {
    //make sure return looks like the interface
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  //check if user is logged in
  const session = await auth();
  if (!session || !session.user) {
    return {
      errors: {
        _form: ["You must be logged in to complete action"],
      },
    };
  }

  //now need to use the slug. to create a post, you need the topicId, which is the slug (name of the topic, ie javascript). we got the
  //slug from the frontend, now we check the db to see if the slug exists as a topic. It is the Post schema from Prisma
  const topic = await db.topic.findFirst({
    where: { slug: slug },
  });

  if (!topic) {
    return {
      errors: {
        _form: ["Cannot find topic"],
      },
    };
  }

  //create post..post declared out here because we are redirecting user at the end
  let post: Post;
  try {
    post = await db.post.create({
      data: {
        title: result.data.title,
        content: result.data.content,
        userId: session.user.id,
        topicId: topic.id,
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
          _form: ["Failed to create post"],
        },
      };
    }
  }

  //revalidate topic show page
  revalidatePath(paths.topicShowPath(slug))
  redirect(paths.postShowPath(slug, post.id))
}
