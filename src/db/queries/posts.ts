import type { Post } from "@prisma/client";
import { db } from "@/db";

//query file with db requests

//this one is a more streamlined example. 
// export type PostWithData = Awaited<
//   ReturnType<typeof fetchPostsByTopicSlug>
// >[number];

// export function fetchPostsByTopicSlug(slug: string) {
//   return db.post.findMany({
//     where: { topic: { slug: slug } },
//     include: {
//       topic: { select: { slug: true } },
//       user: { select: { name: true } },
//       _count: { select: { comments: true } },
//     },
//   });
// }

export type PostWithData = Post & {
  topic: { slug: string };
  user: { name: string | null };
  _count: { comments: number };
};

export function fetchPostsByTopicSlug(slug: string): Promise<PostWithData[]> {
  return db.post.findMany({
    where: { topic: { slug: slug } },
    include: {
      topic: { select: { slug: true } },
      user: { select: { name: true } },
      _count: { select: { comments: true } },
    },
  });
}
