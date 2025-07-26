import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "./ChatPage.css";

export default function ChatPage() {
  const { userId, doctorId } = useParams(); // ✅ userId instead of currentUserId
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  let typingTimeout;

  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.disconnect(); // cleanup
  }, []);

  const roomId = [userId, doctorId].sort().join("_");
  useEffect(() => {
    const fetchOldMessages = async () => {
      try {
        const res = await axios.get(
          `/messages/${roomId}?userId=${currentUser._id}`
        );
        setChat(res.data); // Set the old chat before new messages arrive
      } catch (err) {
        console.error("❌ Failed to fetch old messages:", err);
      }
    };

    if (currentUser && receiver) {
      fetchOldMessages();
    }
  }, [roomId, currentUser, receiver]);

  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit("register_user", currentUser._id);
    }
  }, [socket, currentUser]);

  // ✅ Fetch both from /api/users/
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("User ID:", userId);
        console.log("Doctor ID:", doctorId);
        const userRes = await axios.get(`/users/${userId}`);
        const doctorRes = await axios.get(`/users/${doctorId}`);

        setCurrentUser(userRes.data);
        setReceiver(doctorRes.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchData();
  }, [userId, doctorId]);

  useEffect(() => {
    if (!currentUser || !receiver) return;

    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setChat((prev) => [...prev, data]);
      // If you are the receiver, mark it seen
      if (data.receiver === currentUser._id) {
        socket.emit("mark_seen", {
          room: roomId,
          messageId: data._id,
          sender: data.sender,
        });
        // 2. Notify sender that message was delivered
        socket.emit("message_delivered", {
          room: roomId,
          messageId: data._id,
          sender: data.sender,
        });
      }
    });
    socket.on("message_delivered", ({ messageId }) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === messageId && msg.status !== "seen"
            ? { ...msg, status: "delivered" }
            : msg
        )
      );
    });

    socket.on("typing", () => {
      setTyping(true);
    });
    socket.on("stop_typing", () => {
      setTyping(false);
    });

    socket.on("message_seen", ({ messageId }) => {
      setChat((prev) =>
        prev.map((msg) =>
          msg._id === messageId ? { ...msg, status: "seen" } : msg
        )
      );
    });
    return () => {
      socket.off("receive_message");
      socket.off("message_seen");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [roomId, currentUser, receiver, socket]);

  useEffect(() => {
    if (socket && currentUser && receiver) {
      socket.emit("mark_seen", { room: roomId });
    }
  }, [socket, roomId, currentUser, receiver]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const newMsg = {
      sender: currentUser._id,
      receiver: receiver._id,
      message,
      room: roomId,
      time: new Date().toLocaleTimeString(),
      status: "sent",
    };

    try {
      // Save to DB
      const res = await axios.post("/messages", newMsg);

      // Emit the saved message (with _id from MongoDB)
      socket.emit("send_message", res.data);

      setChat((prev) => [...prev, res.data]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (!currentUser || !receiver) return <p>Loading chat...</p>;
  {
    /* <p key={i} className={msg.sender === userId ? "sent" : "received"}> */
  }

  const handleDeleteMessage = async (msg) => {
    const isSender = msg.sender === currentUser._id;

    const choice = window.confirm(
      isSender
        ? "Delete for everyone?\nClick 'OK' for Delete for Everyone"
        : "Do you want to delete this message for yourself?"
    );

    try {
      if (choice && isSender) {
        // ✅ Delete for Everyone
        await axios.put(`/messages/delete-for-everyone/${msg._id}`);
        setChat((prev) => prev.filter((m) => m._id !== msg._id));
      } else {
        // ✅ Delete for Me
        await axios.put(`/messages/delete-for-me/${msg._id}`, {
          userId: currentUser._id,
        });
        setChat((prev) => prev.filter((m) => m._id !== msg._id));
      }
    } catch (err) {
      console.error("❌ Error deleting message:", err);
      alert("Failed to delete message.");
    }
  };

  return (
    <div>
      <div className="chat-container">
        <h2>You are Chatting with {receiver.name}</h2>
        {typing && <p className="typing-indicator">Typing...</p>}
        <div className="chat-box">
          {chat.map((msg, i) => (
            <div
              key={i}
              className={`message-wrapper ${
                msg.sender === currentUser._id ? "sent" : "received"
              }`}
            >
              <p>
                <span>{msg.message}</span>
                <small>
                  {msg.time}
                  {msg.sender === currentUser._id && (
                    <>
                      {" "}
                      · {msg.status === "sent" && "✓"}
                      {msg.status === "delivered" && "✓✓"}
                      {msg.status === "seen" && (
                        <span style={{ color: "blue" }}>✓✓</span>
                      )}
                    </>
                  )}
                </small>
              </p>

              {/* 🗑️ DELETE OPTIONS */}
              <div className="delete-options">
                <button onClick={() => handleDeleteMessage(msg)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);

            // Emit typing
            socket.emit("typing", { room: roomId });

            // Prevent continuous firing
            if (typingTimeout) clearTimeout(typingTimeout);
            typingTimeout = setTimeout(() => {
              socket.emit("stop_typing", { room: roomId });
            }, 1000);
          }}
          placeholder="Type message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
      <button className="back-button" onClick={() => navigate(-1)}>
        ⬅️
      </button>
    </div>
  );
}
