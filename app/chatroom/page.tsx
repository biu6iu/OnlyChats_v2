"use client";

import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  const handleEmoji = (e: any) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  };

  return (
    <div className="chat">
      <div className="header">
        <div className="groupTopic">
          <span>Group Topic</span>
        </div>
      </div>

      <div className="top">
        <div className="user">
          <div className="user-info">
            <img src="/avatar.png" alt="" />
            <div className="user-name">
              <span>Jane Doe</span>
            </div>
          </div>
          <div className="groupinfo">
            <p>What's your go-to dinner when you're too tired to cook</p>
          </div>
        </div>
      </div>

      <div className="center"></div>
      <div className="bottom">
        <div className="icons">
          <img src="/Vector.svg" alt="" />
        </div>

        <div className="emoji">
          <img
            src="/smile.svg"
            alt=""
            onClick={() => setOpen((prev) => !prev)}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Type your comment here"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="send-button">
          <img src="/send2.svg" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
