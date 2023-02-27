import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Switch, Route } from "wouter";
import { queryClient } from "./api";
import { Conversations } from "./screens/Conversations";
import { Conversation } from "./screens/Conversation";

const Routes = () => {
    return (
        <Switch>
            <Route path="/" component={Conversations} />
            <Route path="/:slug" component={Conversation} />
        </Switch>
    );
};

export const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Routes />
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};
