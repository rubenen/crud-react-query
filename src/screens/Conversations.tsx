import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { api } from "../api";

type MessageResponse = {
    id: string;
    text: string;
    sentAt: string;
};

type ConversationResponse = {
    id: string;
    slug: string;
    messages: MessageResponse[];
};

type ConversationResponsePreview = Omit<ConversationResponse, "messages">;

export const Conversations = () => {
    const { data } = useQuery({
        queryKey: ["conversations"],
        queryFn: () =>
            api.get("/conversations").json<ConversationResponsePreview[]>(),
    });

    if (!data) {
        return <div className="p-2">Loading...</div>;
    }

    return (
        <div className="p-2">
            <ul>
                {data.map((conversation) => (
                    <li key={conversation.id}>
                        <Link to={`/${conversation.slug}`}>
                            {conversation.slug}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};
