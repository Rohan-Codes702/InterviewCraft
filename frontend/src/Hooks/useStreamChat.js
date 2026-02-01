import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { StreamChat } from "stream-chat";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../lib/api.js";

const STREAM_API_KEY = import.meta.env.VITE_STREAM_API_KEY;

export const useStreamChat = () => {
    const { user } = useUser();
    const [chatClient, setChatClient] = useState(null);


    const { data: tokenData, isLoading: isLoading, error: error } = useQuery({
        queryKey: ["streamToken"],
        queryFn: getStreamToken,
        enabled: !!user?.id,
    });

    useEffect(() => {
        const initChat = async () => {
            if (!user || !tokenData) return;
            const client = StreamChat.getInstance(STREAM_API_KEY);
            await client.connectUser(
                {
                    id: user.id,
                    name: user.fullName,
                    image: user.profileImageUrl,
                },
                tokenData
            );
            setChatClient(client);
        };
        initChat();
    }, [user, tokenData]);

    return { chatClient, isLoading, error };
};
