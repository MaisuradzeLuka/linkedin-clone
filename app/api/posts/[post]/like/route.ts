import connectToDb from "@/mongodb";
import { PostSchema } from "@/mongodb/schemas/Post";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { user, postId } = await request.json();

  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 400 });
  }

  try {
    await connectToDb();

    const updatedPost = await PostSchema.findOneAndUpdate(
      { _id: postId },
      { $addToSet: { likes: user } },
      { new: true }
    );

    return NextResponse.json(updatedPost.likes);
  } catch (error) {
    return NextResponse.json({ error: `Error while liking a post ${error}` });
  }
}
