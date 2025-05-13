import connectToDb from "@/mongodb";
import { PostSchema } from "@/mongodb/schemas/Post";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    await connectToDb();

    const posts = await PostSchema.find().sort({ createdAt: -1 });

    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: `Error while getting posts: ${error}` });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  if (!body.user)
    return NextResponse.json({ error: "Unauthorised" }, { status: 400 });

  try {
    await connectToDb();

    const newPost = await PostSchema.create(body);

    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json(
      { error: `Error while posting a post ${error}` },
      { status: 500 }
    );
  }
}
