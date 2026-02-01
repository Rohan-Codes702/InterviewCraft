import { UserButton } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import "./home.css";
import { useStreamChat } from "../Hooks/useStreamChat";
import PageLoader from "../components/PageLoader";
import CustomChannelHeader from "../components/CustomChannelHeader";
import CreateChannelModal from "../components/CreateChannelModel";

import "../styles/stream-chat-theme.css";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import { PlusIcon } from "lucide-react";

const HomePage = () => {
  const [activeChannel, setActiveChannel] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const { chatClient, isLoading, error } = useStreamChat();

  useEffect(() => {
    if (chatClient) {
      const initChannel = async () => {
        const channelId = searchParams.get("channelId") || "general";
        const channel = chatClient.channel("messaging", channelId, {
          name: "General",
        });

        await channel.watch();
        setActiveChannel(channel);
      };
      initChannel();
    }
  }, [chatClient, searchParams]);

  if (error) {
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          {/* LEFT SIDEBAR */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Slap</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
            </div>
          </div>

          {/* ERROR MESSAGE */}
          <div className="chat-main error-container">
            <div className="error-message">
              <p>⚠️ Network Error: Unable to load chat client</p>
              <p className="error-details">{error?.message || "Please check your connection and try again"}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="retry-button"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (isLoading || !chatClient) {
    return <PageLoader />;
  }

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          {/* LEFT SIDEBAR */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              {/* HEADER */}
              <div className="team-channel-list__header gap-4">
                <div className="brand-container">
                  <img src="/logo.png" alt="Logo" className="brand-logo" />
                  <span className="brand-name">Slap</span>
                </div>
                <div className="user-button-wrapper">
                  <UserButton />
                </div>
              </div>
              {/* CHANNELS LIST */}
              <ChannelList 
                filters={{}}
                sort={{}}
              />
            </div>
          </div>

          {/* RIGHT CONTAINER */}
          <div className="chat-main">
            {activeChannel ? (
              <Channel channel={activeChannel}>
                <Window>
                  <CustomChannelHeader />
                  <MessageList />
                  <MessageInput />
                </Window>
                <Thread />
              </Channel>
            ) : (
              <div className="no-channel-selected">
                <p>Select a channel to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {isCreateModalOpen && (
          <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />
        )}
      </Chat>
    </div>
  );
};

export default HomePage;
