import { UserButton } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useStreamChat } from "../Hooks/useStreamChat";
import PageLoader from "../components/PageLoader";

import {
  Chat,
  Channel,
  ChannelList,
  MessageList,
  MessageInput,
  Thread,
  Window,
} from "stream-chat-react";

import "../styles/stream-chat-theme.css";
import { HashIcon, PlusIcon, UsersIcon } from "lucide-react";
import CreateChannelModal from "../components/CreateChannelModal";
import CustomChannelPreview from "../components/CustomChannelPreview";
import UsersList from "../components/UsersList";
import CustomChannelHeader from "../components/CustomChannelHeader";

const HomePage = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeChannel, setActiveChannel] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { chatClient, error, isLoading } = useStreamChat();

  // set active channel from URL params
  useEffect(() => {
    if (chatClient) {
      const channelId = searchParams.get("channel");
      if (channelId) {
        const channel = chatClient.channel("messaging", channelId);
        setActiveChannel(channel);
      }
    }
  }, [chatClient, searchParams]);

  // Shell header component to keep consistency
  const SidebarHeader = () => (
    <div className="team-channel-list__header gap-4">
      <div className="brand-container">
        <img src="/logo.png" alt="Logo" className="brand-logo" />
        <span className="brand-name">DevTalks</span>
      </div>
      <div className="user-button-wrapper">
        <UserButton />
      </div>
    </div>
  );

  // If there's an error, show a more integrated error state
  if (error) {
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              <SidebarHeader />
              <div className="team-channel-list__content p-4">
                <div className="text-red-400 text-sm bg-red-400/10 p-4 rounded-lg border border-red-400/20">
                  <p className="font-bold mb-2">Connection Error</p>
                  <p className="opacity-80 mb-4">{error.message || "Failed to connect to chat server."}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="chat-main flex items-center justify-center text-gray-400">
            Please ensure your backend server is running on port 5000.
          </div>
        </div>
      </div>
    );
  }

  // If still loading client, show the skeleton sidebar but don't block the main area with a dark color
  if (!chatClient || isLoading) {
    return (
      <div className="chat-wrapper">
        <div className="chat-container">
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              <SidebarHeader />
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button disabled className="create-channel-btn opacity-50 cursor-not-allowed">
                    <PlusIcon className="size-4" />
                    <span>Create Channel</span>
                  </button>
                </div>
                <div className="p-4 text-center text-gray-400 animate-pulse">
                  Connecting to DevTalks...
                </div>
              </div>
            </div>
          </div>
          <div className="chat-main flex items-center justify-center text-gray-400">
             Setting up your workspace...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-wrapper">
      <Chat client={chatClient}>
        <div className="chat-container">
          {/* LEFT SIDEBAR */}
          <div className="str-chat__channel-list">
            <div className="team-channel-list">
              <SidebarHeader />
              <div className="team-channel-list__content">
                <div className="create-channel-section">
                  <button onClick={() => setIsCreateModalOpen(true)} className="create-channel-btn">
                    <PlusIcon className="size-4" />
                    <span>Create Channel</span>
                  </button>
                </div>

                <ChannelList
                  filters={{ members: { $in: [chatClient.user.id] } }}
                  options={{ state: true, watch: true }}
                  Preview={({ channel }) => (
                    <CustomChannelPreview
                      channel={channel}
                      activeChannel={activeChannel}
                      setActiveChannel={(channel) => setSearchParams({ channel: channel.id })}
                    />
                  )}
                  List={({ children, loading, error }) => (
                    <div className="channel-sections">
                      <div className="section-header">
                        <div className="section-title">
                          <HashIcon className="size-4" />
                          <span>Channels</span>
                        </div>
                      </div>

                      {loading && <div className="loading-message">Loading channels...</div>}
                      {error && <div className="error-message">Error loading channels</div>}

                      <div className="channels-list">{children}</div>

                      <div className="section-header direct-messages">
                        <div className="section-title">
                          <UsersIcon className="size-4" />
                          <span>Direct Messages</span>
                        </div>
                      </div>
                      <UsersList activeChannel={activeChannel} />
                    </div>
                  )}
                />
              </div>
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
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
                <div className="p-8 bg-black/5 rounded-full mb-4">
                  <HashIcon className="size-12 opacity-20" />
                </div>
                <p className="text-xl font-medium">Welcome to DevTalks</p>
                <p className="opacity-60">Select a channel or user to start chatting</p>
              </div>
            )}
          </div>
        </div>

        {isCreateModalOpen && <CreateChannelModal onClose={() => setIsCreateModalOpen(false)} />}
      </Chat>
    </div>
  );
};
export default HomePage;