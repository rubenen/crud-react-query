import { QueryClient } from "@tanstack/react-query";
import wretch from "wretch";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

const BASE_URL =
    "https://rubenen-automatic-meme-pw9q5jgx5jx35px-3000.preview.app.github.dev";

export const api = wretch(BASE_URL).resolve((resolver) => {
    return resolver.notFound((res) => {
        throw new Error(`Url not found: ${res.url}`);
    });
});
