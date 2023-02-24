import { useQuery } from "@tanstack/react-query";
import { api } from "../api";
import type { Params } from "wouter";

type ConversationParams = {
    slug: string;
};

type ConversationProps = {
    params: Params<ConversationParams>;
};

export const Conversation = ({ params }: ConversationProps) => {
    const { slug } = params;
    const { data, isLoading, error } = useQuery({
        queryKey: ["conversation", slug],
        queryFn: () => api.get(`/conversations/${slug}`).json(),
    });

    return (
        <div className="p-2">
            <h1>Conversation</h1>
            <pre>
                {error ? `Error: ${JSON.stringify(error, null, 2)}` : null}
                {isLoading ? "Loading..." : JSON.stringify(data, null, 2)}
            </pre>
        </div>
    );
};
