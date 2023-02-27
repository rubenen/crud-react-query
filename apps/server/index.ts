import express from "express";
import cors from "cors";
import { conversations } from "./api/conversations";

const app = express();
const port = 4576;

app.use(cors());
app.use(express.json());

app.use("/api/conversations", conversations);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
