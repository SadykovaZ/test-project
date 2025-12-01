import { CommentItem } from "./pages/ArticlePage";

export default function CommentList({
  comments,
}: {
  comments?: CommentItem[];
}) {
  return (
    <>
      <h3>Comments</h3>
      {comments?.map((comment) => (
        <div key={comment.text}>
          <h4>{comment.postedBy}</h4>
          <p>{comment.text}</p>
        </div>
      ))}
    </>
  );
}
