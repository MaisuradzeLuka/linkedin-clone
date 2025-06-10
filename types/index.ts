export type PostType = {
  text: string;
  user: SafeUser;
  postImage?: string;
  likes?: string[];
};

export type CommentType = {
  _id: string;
  user: {
    _id: any;
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
  _id: string;
  userId: string;
  firstname: string | null;
  lastname: string | null;
  avatar: string | undefined;
  username?: string;
  bio?: string;
  backgroundImg?: string;
};
