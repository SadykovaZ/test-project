import { Link } from "react-router-dom";
import { ArticlesProps } from "./article-content";

export default function ArticleList({
  articles,
}: {
  articles: ArticlesProps[];
}) {
  return (
    <>
      {articles.map((a) => (
        <Link key={a.name} to={`/articles/${a.name}`}>
          <h3>{a.title}</h3>
          <p>{a.content[0].substring(0, 150)}</p>
        </Link>
      ))}
    </>
  );
}
