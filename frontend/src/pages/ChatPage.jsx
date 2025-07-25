import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "./ChatPage.css";

// 🔗 Connect to backend server with correct CORS origin allowed
// const socket = io(process.env.REACT_APP_API_URL, {
//   transports: ["websocket", "polling"],
//   withCredentials: true,
// });

export default function ChatPage() {
  const { userId, doctorId } = useParams(); // ✅ userId instead of currentUserId
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typing, setTyping] = useState(false);
  let typingTimeout;

  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });
    setSocket(newSocket);

    return () => newSocket.disconnect(); // cleanup
  }, []);

  const roomId = [userId, doctorId].sort().join("_");

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
    });
    socket.on("typing", () => {
      setTyping(true);
    });
    socket.on("stop_typing", () => {
      setTyping(false);
    });

    return () => {
      socket.off("receive_message");
      socket.off("typing");
      socket.off("stop_typing");
    };
  }, [roomId, currentUser, receiver]);

  const sendMessage = () => {
    if (!message.trim()) return;
    // const newMsg = {
    //   sender: userId,
    //   receiver: doctorId,
    //   message,
    //   room: roomId,
    //   time: new Date().toLocaleTimeString(),
    // };
    const newMsg = {
      sender: currentUser._id,
      receiver: receiver._id,
      message,
      room: roomId,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("send_message", newMsg);
    setChat((prev) => [...prev, newMsg]);
    setMessage("");
  };

  if (!currentUser || !receiver) return <p>Loading chat...</p>;
  {
    /* <p key={i} className={msg.sender === userId ? "sent" : "received"}> */
  }
  return (
    <div className="chat-container">
      <h2>Chat with {receiver.name}</h2>
      {typing && <p className="typing-indicator">Typing...</p>}
      <div className="chat-box">
        {chat.map((msg, i) => (
          <p
            key={i}
            className={msg.sender === currentUser._id ? "sent" : "received"}
          >
            <span>{msg.message}</span>
            <small>{msg.time}</small>
          </p>
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
  );
}
