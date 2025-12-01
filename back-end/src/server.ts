import express from "express";
import { MongoClient, Db } from "mongodb";
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const credentials = JSON.parse(fs.readFileSync("./credentials.json", "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(credentials as any),
});

type Article = {
  name: string;
  upVotes: number;
  upvoteIds?: string[];
  comments?: { postedBy?: string; text?: string }[];
};

const app = express();

app.use(express.json());

let db: Db;

async function connectToDB() {
  const uri = !process.env.MONGODB_USERNAME
    ? "mongodb://127.0.0.1:27017"
    : process.env.MONGODB_URI;

  if (uri) {
    const client = new MongoClient(uri);

    await client.connect();

    db = client.db("full-stack-react-db");
  } else {
    console.log(
      `uri=${uri}`,
      `process.env.MONGODB_URI=${process.env.MONGODB_URI}`
    );
  }
}

app.use(express.static(path.join(__dirname, "../dist")));

app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.get("/api/articles/:name", async (req, res) => {
  const { name } = req.params;

  const articles = await db.collection("articles").findOne({ name });

  res.json(articles);
});

app.use(async function (req, res, next) {
  const { authtoken } = req.headers;

  if (authtoken) {
    const user = await admin.auth().verifyIdToken(authtoken as string);
    req.user = user;
    next();
  } else {
    res.sendStatus(400);
  }
});

app.post("/api/articles/:name/upvote", async (req, res) => {
  const { name } = req.params;
  const uid = req.user?.uid;

  const article = await db.collection<Article>("articles").findOne({ name });

  const upvoteIds = article?.upvoteIds || [];
  const canUpvote = uid && !upvoteIds?.includes(uid);

  if (canUpvote) {
    const updatedArticle = await db
      .collection<Article>("articles")
      .findOneAndUpdate(
        { name },
        {
          $inc: { upVotes: 1 },
          $push: { upvoteIds: uid },
        },
        {
          returnDocument: "after",
        }
      );
    res.json(updatedArticle);
  } else {
    res.sendStatus(403);
  }
});

app.post("/api/articles/:name/comments", async (req, res) => {
  const { name } = req.params;
  const { postedBy, text } = req.body;
  const newComment = { postedBy, text };

  const updatedArticle = await db
    .collection<Article>("articles")
    .findOneAndUpdate(
      {
        name,
      },
      {
        $push: { comments: newComment },
      },
      { returnDocument: "after" }
    );

  res.json(updatedArticle);
});

const PORT = process.env.PORT || 8000;

async function start() {
  await connectToDB();
  app.listen(PORT, function () {
    console.log("Server is listening on port 8000");
  });
}

start();
