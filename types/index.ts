export type PostType = {
  text: string;
  user: {
    firstname: string;
    lastname?: string;
    avatar: string;
    userId: string;
  };
  postImage?: String;
  likes?: string[];
};

export type CommentType = {
  _id: string;
  user: {
    firstname: string;
    lastname?: string;
    avatar: string;
    userId: string;
  };
  comment: string;
  createdAt: string;
};

export type FetchedPostType = PostType & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  comments: CommentType[] | undefined;
};

export type SafeUser = {
  userId: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string;
};
