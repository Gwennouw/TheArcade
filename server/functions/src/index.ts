const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors({origin: true}));

const admin = require("firebase-admin");

const serviceAccount = require("../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.get("/hello-world", (req: any, res: any) => {
  return res.status(200).send("Hello World!");
});

const db = admin.firestore();

const scoreBoard = db.collection("scoreBoard");

const topTen = scoreBoard.orderBy("score", "desc").limit(10);

app.get("/get-scores", async (req: any, res: any) => {
  try {
    const response: any = [];
    await topTen.get().then((queryResult: { docs: any }) => {
      const docs = queryResult.docs;
      for (const doc of docs) {
        response.push(doc.data());
      }
    });
    return res.status(200).send(response);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

app.post("/publish-scores", async (req: any, res: any) => {
  const newScore = req.body;
  try {
    await topTen.get().then((queryResult: { docs: any }) => {
      const docs = queryResult.docs;
      let worthyScore: boolean = false;

      for (let i = 0; i < docs.length; i++) {
        if (newScore.score > docs[i].score) {
          worthyScore = true;
        }
      }

      if (worthyScore || docs.length <= 10) {
        (async () => {
          await scoreBoard
              .doc("/" + Math.floor(Math.random() * 1000) + "/")
              .create({
                name: newScore.name,
                score: newScore.score,
              });
        })();

        return res.status(200).send("Published score!");
      }
      return res.status(200).send("Score not high enough");
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

exports.app = functions.https.onRequest(app);
