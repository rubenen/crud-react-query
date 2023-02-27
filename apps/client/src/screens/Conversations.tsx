import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "../api";
import { Button } from "../components/Button";

export type MessageResponse = {
    id: string;
    text: string;
    sentAt: string;
};

export type ConversationResponse = {
    id: string;
    slug: string;
    messages: MessageResponse[];
};

type ConversationResponsePreview = Omit<ConversationResponse, "messages">;

export const Conversations = () => {
    const queryClient = useQueryClient();
    const { data } = useQuery({
        queryKey: ["conversations"],
        queryFn: () =>
            api.get("/conversations").json<ConversationResponsePreview[]>(),
    });

    const { mutate: createConversation } = useMutation({
        mutationFn: () => api.post(null, "/conversations").json(),
        onSuccess: () => queryClient.invalidateQueries(),
    });

    if (!data) {
        return <div className="p-2">Loading...</div>;
    }

    return (
        <div className="p-2">
            <Button onClick={() => createConversation()}>
                New conversation +
            </Button>
            <ul className="py-2">
                {data.map((conversation) => (
                    <li key={conversation.id}>
                        <Link
                            to={`/${conversation.slug}`}
                            className="block hover:underline hover:bg-neutral-100 px-4 py-2"
                        >
                            {conversation.slug} ({conversation.id})
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
