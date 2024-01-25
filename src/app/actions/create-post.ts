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
export async function createPost(
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

 const session = await auth()
 if(!session || !session.user) {
    return {
        errors: {
            _form:['You must be logged in to complete action']
        }
    }
 }

  return {
    errors: {},
  };
  //revalidate topic show page
}
