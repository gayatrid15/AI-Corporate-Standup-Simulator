import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  return (
    <div className="chat-window p-4">
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          sender={message.sender}
          text={message.text}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
