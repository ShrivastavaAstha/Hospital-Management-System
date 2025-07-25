import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import "./ChatPage.css";

// 🔗 Connect to backend server with correct CORS origin allowed
const socket = io("http://localhost:5000");

export default function ChatPage() {
  const { userId, doctorId } = useParams(); // ✅ userId instead of currentUserId
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [receiver, setReceiver] = useState(null);

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

    return () => {
      socket.off("receive_message");
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
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
