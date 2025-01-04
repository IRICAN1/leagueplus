import { useEffect, useState } from "react";
import { MessageList } from "@/components/messages/MessageList";
import { ChatArea } from "@/components/messages/ChatArea";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MessageLayoutProps {
  selectedConversation: string | null;
  showList: boolean;
  setShowList: (show: boolean) => void;
  onSelectConversation: (id: string) => void;
  otherUser: {
    fullName?: string | null;
    username?: string | null;
    avatarUrl?: string | null;
  } | null;
}

export const MessageLayout = ({
  selectedConversation,
  showList,
  setShowList,
  onSelectConversation,
  otherUser
}: MessageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border bg-white shadow-lg">
      <div 
        className={`${
          isMobile ? 'w-full fixed inset-0 z-10 bg-white transition-transform duration-300 transform mt-16' : 'w-1/3'
        } ${
          isMobile && !showList ? 'translate-x-[-100%]' : 'translate-x-0'
        } border-r`}
      >
        <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
          <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
        </div>
        <MessageList
          selectedConversation={selectedConversation}
          onSelectConversation={onSelectConversation}
        />
      </div>
      <div 
        className={`${
          isMobile ? 'w-full fixed inset-0 bg-white transition-transform duration-300 transform mt-16' : 'w-2/3'
        } ${
          isMobile && showList ? 'translate-x-[100%]' : 'translate-x-0'
        }`}
      >
        {isMobile && selectedConversation && (
          <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50 flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowList(true)}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Button>
            {otherUser && (
              <span className="font-semibold text-gray-800">
                {otherUser.fullName || otherUser.username || "Unknown User"}
              </span>
            )}
          </div>
        )}
        <ChatArea conversationId={selectedConversation} />
      </div>
    </div>
  );
};