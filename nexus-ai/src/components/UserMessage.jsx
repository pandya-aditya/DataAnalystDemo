export default function UserMessage({ text, time }) {
  return (
    <div className="user-message">
      <div className="user-message-text">{text}</div>
      <div className="user-message-time">{time}</div>
    </div>
  )
}
