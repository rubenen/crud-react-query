import express from "express";
import randomWords from "random-words";
import { prisma } from "../db/client";

const router = express.Router();

router.get("/", async (req, res) => {
    const conversations = await prisma.conversation.findMany();
    res.json(conversations);
});

router.get("/:slug", async (req, res) => {
    const conversation = await prisma.conversation.findUnique({
        where: {
            slug: req.params.slug,
        },
        select: {
            id: true,
            slug: true,
            messages: {
                select: {
                    id: true,
                    text: true,
                    sentAt: true,
                },
            },
        },
    });

    if (!conversation) {
        res.status(404).send("Not found");
        return;
    }

    res.json(conversation);
});

router.post("/", async (req, res) => {
    const conversation = await prisma.conversation.create({
        data: {
            slug: randomWords({ exactly: 3, join: "-" }),
        },
    });
    res.json(conversation);
});

router.post("/:id/messages", async (req, res) => {
    const { text } = req.body;
    const { id } = req.params;
    const message = await prisma.message.create({
        data: {
            text,
            conversationId: parseInt(id),
        },
    });
    res.json(message);
});

router.delete("/:slug", async (req, res) => {
    const { slug } = req.params;
    const conversation = await prisma.conversation.delete({
        where: {
            slug,
        },
    });
    res.json(conversation);
});

export { router as conversations };
