import { useState, useEffect } from "react";
import { useUser, useAuth } from "@clerk/clerk-react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
    const { user } = useUser();
    const [chatClient, setChatClient] = useState(null);


    const { getToken } = useAuth();

    const { data: tokenData, isLoading: isLoading, error: error } = useQuery({
        queryKey: ["streamToken"],
        queryFn: async () => {
            // retrieve a Clerk token for authenticating to our backend
            const clerkToken = await getToken();
            // call backend endpoint and return only the stream token string
            const resp = await getStreamToken(clerkToken);
            return resp;
        },
        enabled: !!user?.id && !!getToken,
    });

    const [connectionError, setConnectionError] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            if (!user || !tokenData) return;
            try {
                const client = StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser(
                    {
                        id: user.id,
                        name: user.fullName || user.username || user.id,
                        image: user.imageUrl,
                    },
                    tokenData
                );
                setChatClient(client);
                setConnectionError(null);
            } catch (err) {
                console.error("Stream connection error:", err);
                setConnectionError(err);
            }
        };
        initChat();
    }, [user, tokenData]);

    return { chatClient, isLoading, error: error || connectionError };
};
