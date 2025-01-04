import { MessageContainer } from "@/components/messages/MessageContainer";
import { MessageLayout } from "@/components/messages/MessageLayout";

const Messages = () => {
  return (
    <div className="container mx-auto px-4 pt-0 pb-6">
      <MessageContainer>
        {({ selectedConversation, showList, setShowList, onSelectConversation, otherUser }) => (
          <MessageLayout
            selectedConversation={selectedConversation}
            showList={showList}
            setShowList={setShowList}
            onSelectConversation={onSelectConversation}
            otherUser={otherUser}
          />
        )}
      </MessageContainer>
    </div>
  );
};

export default Messages;