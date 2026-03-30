import { forwardRef } from 'react'

const UserMessage = forwardRef(function UserMessage({ text, time }, ref) {
  return (
    <div className="user-message" ref={ref}>
      <div className="user-message-text">{text}</div>
      <div className="user-message-time">{time}</div>
    </div>
  )
})

export default UserMessage
