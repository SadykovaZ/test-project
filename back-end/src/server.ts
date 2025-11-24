import express from "express";

const articleInfo: {
  name: string;
  upVotes: number;
  comments: { postedBy: string; text: string }[];
}[] = [
  {
    name: "learn-react",
    upVotes: 0,
    comments: [],
  },
  {
    name: "learn-node",
    upVotes: 0,
    comments: [],
  },
  {
    name: "mongodb",
    upVotes: 0,
    comments: [],
  },
];

const app = express();

app.use(express.json());

app.post("/api/articles/:name/upvote", (req, res) => {
  const article = articleInfo.find((a) => a.name === req.params.name);

  if (article) {
    article.upVotes += 1;
  }

  res.json(article);
});

app.post("/api/articles/:name/comments", (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const article = articleInfo.find((a) => a.name === name);

  if (article) {
    article.comments.push({
      postedBy,
      text,
    });
  }

  res.json(article);
});

app.listen(8000, function () {
  console.log("Server is listening on port 8000");
});
