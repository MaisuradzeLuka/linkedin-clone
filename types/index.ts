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
  comments?: string[];
};

export type FetchedPostType = PostType & {
  _id: string;
  createdAt: string;
  updatedAt: string;
};
