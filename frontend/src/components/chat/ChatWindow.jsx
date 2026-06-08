import MessageBubble from "./MessageBubble";

function ChatWindow({ messages }) {
  return (
    <div className="chat-window p-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={`${message.sender}-${index}`}
          sender={message.sender}
          text={message.text}
          reportUrl={message.reportUrl}
        />
      ))}
    </div>
  );
}

export default ChatWindow;
