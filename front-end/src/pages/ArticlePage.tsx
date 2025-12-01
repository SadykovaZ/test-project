import { useState } from "react";
import { useParams, useLoaderData, Params } from "react-router-dom";
import articles from "../article-content";
import axios from "axios";
import CommentList from "../CommentList";
import AddCommentForm, { AddCommentFormProps } from "../AddCommentForm";
import useUser from "../useUser";

export type CommentItem = {
  postedBy?: string;
  text?: string;
};

type ArticleData = {
  upVotes?: number;
  comments?: CommentItem[];
};

export default function ArticlePage() {
  const { name } = useParams();
  const { upVotes: initialUpVotes, comments: initialComments } =
    useLoaderData() as ArticleData;
  const [upVotes, setUpVotes] = useState(initialUpVotes);
  const [comments, setComments] = useState(initialComments);

  const { user } = useUser();

  const article = articles.find((a) => a.name === name);

  async function onUpvoteClicked() {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};
    const response = await axios.post(`/api/articles/${name}/upvote`, null, {
      headers,
    });
    const updatedArticleData = response.data;
    setUpVotes(updatedArticleData.upVotes);
  }

  async function onAddComment({ nameText, commentText }: AddCommentFormProps) {
    const token = user && (await user.getIdToken());
    const headers = token ? { authtoken: token } : {};

    const response = await axios.post(
      `/api/articles/${name}/comments`,
      {
        postedBy: nameText,
        comment: commentText,
      },
      { headers }
    );
    const updatedArticleData = response.data;
    setComments(updatedArticleData.comments);
  }

  return (
    <>
      <h1>{article?.title}</h1>
      {user && <button onClick={onUpvoteClicked}>Upvote</button>}
      <p>This article has {upVotes}</p>
      {article?.content.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
      {user ? (
        <AddCommentForm onAddComment={onAddComment} />
      ) : (
        <p>Log in to add a comment</p>
      )}
      <CommentList comments={comments} />
    </>
  );
}

export async function Loader({ params }: { params: Params }) {
  const response = await axios.get(`/api/articles/${params.name}`);
  const { upVotes, comments } = response.data;
  return { upVotes, comments };
}
