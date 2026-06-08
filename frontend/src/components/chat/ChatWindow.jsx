import MessageBubble from "./MessageBubble";
import ReportCard from "./ReportCard";

function ChatWindow({ messages, sessionId }) {
  return (
    <div className="chat-window p-4">
      {messages.map((message, index) => {
        if (message.sender === "system") {
          return <ReportCard key={index} sessionId={message.sessionId} />;
        }

        return (
          <MessageBubble
            key={`${message.sender}-${index}`}
            sender={message.sender}
            text={message.text}
          />
        );
      })}
    </div>
  );
}

export default ChatWindow;

// import MessageBubble from "./MessageBubble";

// function ChatWindow({ messages }) {
//   return (
//     <div className="chat-window p-4">
//       {messages.map((message, index) => (
//         <MessageBubble
//           key={`${message.sender}-${index}`}
//           sender={message.sender}
//           text={message.text}
//           reportUrl={message.reportUrl}
//         />
//       ))}
//     </div>
//   );
// }

// export default ChatWindow;
