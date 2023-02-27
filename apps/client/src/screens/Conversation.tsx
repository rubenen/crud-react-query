import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api";
import { useLocation, Params, Link } from "wouter";
import { Button } from "../components/Button";
import type { ConversationResponse, MessageResponse } from "./Conversations";

type ConversationParams = {
    slug: string;
};

type ConversationProps = {
    params: Params<ConversationParams>;
};

export const Conversation = ({ params }: ConversationProps) => {
    const queryClient = useQueryClient();
    const [, navigate] = useLocation();
    const { slug } = params;
    const {
        data: conversationData,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["conversation", slug],
        queryFn: () =>
            api.get(`/conversations/${slug}`).json<ConversationResponse>(),
    });

    const { mutate: deleteConversation } = useMutation({
        mutationFn: ({ slug }: { slug: string }) =>
            api.delete(`/conversations/${slug}`).json(),
        onSuccess: async () => {
            // use await to make sure the list is refetched before navigating
            // await queryClient.refetchQueries(["conversations"]);
            await queryClient.refetchQueries({
                queryKey: ["conversations"],
            });
            navigate("/");
        },
    });

    const { mutate: sendMessage } = useMutation({
        mutationFn: ({
            text,
            conversationId,
        }: {
            text: string;
            conversationId: string;
        }) =>
            api
                .post({ text }, `/conversations/${conversationId}/messages`)
                .json(),
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const target = e.target as HTMLFormElement;
        const data = new FormData(target);
        const text = data.get("text") as string;
        const conversationId = conversationData?.id;

        if (!conversationId) {
            throw new Error("No conversation id");
        }

        if (text.trim().length > 0 && !target.ariaBusy) {
            target.ariaBusy = "true";
            sendMessage(
                { text, conversationId },
                {
                    onSuccess: () => {
                        queryClient.invalidateQueries();
                    },
                    onSettled: () => {
                        target.removeAttribute("aria-busy");
                        target.reset();
                    },
                }
            );
        }
    };

    return (
        <div className="p-2">
            <nav className="flex gap-1">
                <Link
                    to="/"
                    className="bg-neutral-900 hover:bg-neutral-800 active:bg-neutral-700 text-white px-4 py-2 h-9 flex items-center focus-visible:ring focus:outline-none"
                >
                    Back
                </Link>
                <Button onClick={() => deleteConversation({ slug })}>
                    Delete
                </Button>
            </nav>
            {conversationData?.slug}
            <pre>
                {error ? `Error: ${JSON.stringify(error, null, 2)}` : null}
            </pre>
            {isLoading ? (
                "Loading..."
            ) : (
                <Messages messages={conversationData?.messages || []} />
            )}
            <form onSubmit={handleSubmit}>
                <div className="flex items-center">
                    <input
                        placeholder="Type your message here..."
                        name="text"
                        type="text"
                        className="flex-1 w-full p-2 bg-neutral-100 focus:outline-none focus-visible:ring"
                    />
                    <Button type="submit" className="h-auto">
                        Send
                    </Button>
                </div>
            </form>
        </div>
    );
};

const Messages = ({ messages }: { messages: MessageResponse[] }) => {
    return (
        <ul className="py-2">
            {messages.map((message) => (
                <li key={message.id}>
                    <div className="px-4 py-2">
                        <div className="text-xs text-neutral-500">
                            {message.sentAt}
                        </div>
                        <div>{message.text}</div>
                    </div>
                </li>
            ))}
        </ul>
    );
};
