import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../API";

const CommunityPrivateChats = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(null);

  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

// Modify chat item click
const handleChatSelect = (friendId) => {
  setActiveChat(friendId);
  if (window.innerWidth <= 768) {
    setIsMobileChatActive(true);
  }
};

// Handle back navigation (mobile)
const handleBackToList = () => {
  setIsMobileChatActive(false);
};



  // Parse user data from localStorage
  let userData = {};
  try {
    const storedUser = localStorage.getItem("com-user");
    userData = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }
  const userId = userData?.userId; // Changed from userData._id to userData.userId
  const userName = userData?.name;

  // Redirect to login if user data is missing
  useEffect(() => {
    if (!userId || !userName) {
      console.error("User not logged in: userId or userName missing", {
        userId,
        userName,
        userData,
      });
      navigate("/CommunityLogin");
    }
  }, [userId, userName, navigate]);

  // Fetch chats, friends, and friend requests
  const fetchChats = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/getchats/${userId}`);
      const chatData = response.data.chats.reduce(
        (acc, chat) => ({
          ...acc,
          [chat.friendId]: chat.messages.map((msg) => ({
            text: msg.text,
            type: msg.senderId === userId ? "sent" : "received",
            createdAt: msg.createdAt,
          })),
        }),
        {}
      );
      setChats(chatData);
      setFriendRequests(response.data.friendRequests);
      setFriends(response.data.friends);
      if (!activeChat && response.data.friends.length > 0) {
        setActiveChat(response.data.friends[0].userId);
      }
    } catch (error) {
      console.error(
        "Error fetching chats:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error fetching chats");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchChats();
    }
  }, [userId]);

  // Set up SSE for real-time messages
  useEffect(() => {
    if (!userId) return;
    const eventSource = new EventSource(`${API}/messages/stream/${userId}`);
    eventSource.onmessage = (event) => {
      if (event.data === "{}") return; // Ignore heartbeat
      try {
        const newMessages = JSON.parse(event.data);
        setChats((prev) => {
          const updatedChats = { ...prev };
          newMessages.forEach((chat) => {
            if (!updatedChats[chat.friendId]) {
              updatedChats[chat.friendId] = [];
            }
            chat.messages.forEach((msg) => {
              updatedChats[chat.friendId].push({
                text: msg.text,
                type: msg.senderId === userId ? "sent" : "received",
                createdAt: msg.createdAt,
              });
            });
          });
          return updatedChats;
        });
      } catch (error) {
        console.error("SSE parse error:", error);
      }
    };
    eventSource.onerror = (error) => {
      console.error("SSE error:", error);
      eventSource.close();
    };
    return () => eventSource.close();
  }, [userId]);

  // Handle message send
  const handleSend = async () => {
    if (newMessage.trim() === "" || !activeChat) return;
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/sendmessage`, {
        senderId: userId,
        recipientId: activeChat,
        text: newMessage,
      });
      setChats((prev) => ({
        ...prev,
        [activeChat]: [
          ...(prev[activeChat] || []),
          { text: newMessage, type: "sent", createdAt: new Date() },
        ],
      }));
      setNewMessage("");
    } catch (error) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error sending message");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleFriendRequestClick = (request) => {
    setShowDialog(request);
  };

  const handleAcceptFriend = async (senderId, senderName) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/acceptfriend`, {
        senderId,
        userId,
      });
      alert(`Friend request from ${senderName} accepted!`);
      setFriendRequests((prev) =>
        prev.filter((req) => req.userId !== senderId)
      );
      setFriends((prev) => [...prev, { userId: senderId, name: senderName }]);
      setChats((prev) => ({ ...prev, [senderId]: [] }));
      setShowDialog(null);
    } catch (error) {
      console.error(
        "Error accepting friend request:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error accepting friend request");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle reject friend request
  const handleRejectFriend = async (senderId, senderName) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/rejectfriend`, {
        senderId,
        userId,
      });
      alert(`Friend request from ${senderName} rejected.`);
      setFriendRequests((prev) =>
        prev.filter((req) => req.userId !== senderId)
      );
      setShowDialog(null);
    } catch (error) {
      console.error(
        "Error rejecting friend request:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error rejecting friend request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="privatechats" className={isMobileChatActive ? "mobile-chat-active" : ""}>
      <div className="whatsapp-container">
        <div className="sidebar">
          <div className="sidebar-header">Chats</div>
          <div className="chat-list">
            {friendRequests.map((request) => (
              <div
                key={request.userId}
                className="chat-item friend-request"
                onClick={() => handleFriendRequestClick(request)}
              >
                {request.name} (Pending)
              </div>
            ))}
           {friends.map((friend) => (
  <div
    key={friend.userId}
    className={`chat-item ${activeChat === friend.userId ? "active" : ""}`}
    onClick={() => handleChatSelect(friend.userId)}
  >


                <img src={friend.profile} alt="profilepicture" />
                <h2>{friend.name}</h2>
              </div>
            ))}
          </div>
        </div>

        <div className="chat-window">
          <div className="chat-header" onClick={handleBackToList}>
  {friends.find((f) => f.userId === activeChat)?.name || "Chat"}
</div>

          <div className="chat-messages">
            {activeChat && chats[activeChat] ? (
              chats[activeChat].map((msg, index) => (
                <div key={index} className={`message ${msg.type}`}>
                  {msg.text}
                </div>
              ))
            ) : (
              <p>
                Select a friend from Community page to start chatting{" "}
                <span>Community page</span>
              </p>
            )}
          </div>
          {activeChat && (
            <div className="chat-input">
              <input
                type="text"
                placeholder="Type a message"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
              <button onClick={handleSend} disabled={isLoading}>
                {isLoading ? "Sending..." : "Send"}
              </button>
            </div>
          )}
        </div>

        {showDialog && (
          <div className="dialog-overlay">
            <div className="dialog">
              <h3>Friend Request</h3>
              <p>Accept friend request from {showDialog.name}?</p>
              <div className="dialog-buttons">
                <button
                  onClick={() =>
                    handleAcceptFriend(showDialog.userId, showDialog.name)
                  }
                  disabled={isLoading}
                >
                  Accept
                </button>
                <button
                  onClick={() =>
                    handleRejectFriend(showDialog.userId, showDialog.name)
                  }
                  disabled={isLoading}
                >
                  Reject
                </button>
                <button
                  onClick={() => setShowDialog(null)}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    

    </div>
  );
};

export default CommunityPrivateChats;
