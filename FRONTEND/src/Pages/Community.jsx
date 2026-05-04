import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../API";

const Community = () => {
  const navigate = useNavigate();
  const [thought, setThought] = useState("");
  const [thoughts, setThoughts] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [selectedThought, setSelectedThought] = useState(null);
  const [profileBox, setProfileBox] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [friendStatus, setFriendStatus] = useState({
    friendRequests: [],
    friends: [],
  });

  let userData = {};
  try {
    const storedUser = localStorage.getItem("com-user");
    userData = storedUser ? JSON.parse(storedUser) : {};
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
  }
  const userId = userData?.userId;
  const userName = userData?.name;

  const fetchFriendStatus = async () => {
    if (!userId || !userName) {
      console.log("No userId or userName, skipping fetchFriendStatus");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/checkfriend/${userId}`);
      setFriendStatus({
        friendRequests: response.data.friendRequests || [],
        friends: response.data.friends || [],
      });
    } catch (error) {
      console.error("Error fetching friend status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendStatus();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId || !userName) {
      alert("Please log in to share thoughts");
      navigate("/CommunityLogin", { replace: true });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/thoughts`, {
        userId,
        text: thought,
      });
      setThought("");
      await fetchThoughts();
      alert("Your thought has been shared successfully.");
    } catch (error) {
      console.error("Error saving thought:", error);
      alert(error.response?.data?.message || "Error sharing thought");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchThoughts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API}/getthoughts`);
      setThoughts(response.data.filter((item) => item.visible === "show"));
    } catch (error) {
      console.error("Error fetching thoughts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  const handleReplyChange = (thoughtId, text) => {
    setReplyText((prev) => ({
      ...prev,
      [thoughtId]: text,
    }));
  };

  const handleReplySubmit = async (thoughtId) => {
    if (!replyText[thoughtId]) return;
    if (!userId || !userName) {
      alert("Please log in to post replies");
      navigate("/CommunityLogin", { replace: true });
      return;
    }
    const newReply = {
      userId,
      text: replyText[thoughtId],
      createdAt: new Date().toISOString(),
      visible: "show",
    };
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/thoughtsreplies/${thoughtId}`, newReply);
      if (selectedThought && selectedThought._id === thoughtId) {
        setSelectedThought((prev) => ({
          ...prev,
          replies: [...(prev.replies || []), { ...newReply, user: userName }],
        }));
      }
      setReplyText((prev) => ({ ...prev, [thoughtId]: "" }));
    } catch (error) {
      console.error("Error adding reply:", error);
      alert(error.response?.data?.message || "Error posting reply");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleAcceptFriend = async (senderId, senderName) => {
  //   if (!userId || !userName) { 
  //     alert("Please log in to accept friend requests");
  //     navigate("/CommunityLogin", { replace: true });
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.post(`${API}/acceptfriend`, { senderId, userId });
  //     alert(`Friend request from ${senderName} accepted!`);
  //     setFriendStatus((prev) => ({
  //       ...prev,
  //       friendRequests: prev.friendRequests.filter((req) => req.userId !== senderId),
  //       friends: [...prev.friends, { userId: senderId, name: senderName }],
  //     }));
  //   } catch (error) {
  //     console.error("Error accepting friend request:", error);
  //     alert(error.response?.data?.message || "Error accepting friend request");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


    useEffect(() => {
      if (thoughts && thoughts.length > 0) {
        setSelectedThought(thoughts[0]);
      }
    }, [thoughts]);
  


  const handleThoughtSelect = (thought) => {
    setSelectedThought(thought);
  };

  const handleOpenProfile = (data) => {
    setProfileBox({ user: data.user, userId: data.userId });
  };

  const handleAddFriend = async (targetId, targetName) => {
    if (!userId || !userName) {
      alert("Please log in to send friend requests");
      navigate("/CommunityLogin", { replace: true });
      return;
    }
    if (targetId === userId) {
      alert("You cannot add yourself as a friend");
      return;
    }
    if (
      friendStatus.friendRequests.some((req) => req.userId === targetId) ||
      friendStatus.friends.some((friend) => friend.userId === targetId)
    ) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(`${API}/friendrequest`, {
        senderId: userId,
        targetId,
      });
      alert(`Friend request sent to ${targetName}!`);
      setFriendStatus((prev) => ({
        ...prev,
        friendRequests: [
          ...prev.friendRequests,
          { userId: targetId, name: targetName },
        ],
      }));
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert(error.response?.data?.message || "Error sending friend request");
    } finally {
    }
  };

  const getFriendButtonText = (targetId) => {
    if (!userId || !userName) {
      return "Log in to add friend";
    }
    if (friendStatus.friends.some((friend) => friend.userId === targetId)) {
      return "Already Friends";
    }
    if (friendStatus.friendRequests.some((req) => req.userId === targetId)) {
      return "Request Sent";
    }
    return "Add Friend +";
  };

  const getFriendButtonClass = (targetId) => {
    if (!userId || !userName) {
      return "addfriend__btn"; 
    }
    if (friendStatus.friends.some((friend) => friend.userId === targetId)) {
      return "addedfriend__btn";
    }
    if (friendStatus.friendRequests.some((req) => req.userId === targetId)) {
      return "pending__btn"; 
    }
    return "addfriend__btn";
  };

  return (
    <div id="sharethoughts">
      {isLoading ? (
        <div className="loading">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="share__container">
          <input type="checkbox" id="sidebar-toggle" hidden />
          <label htmlFor="sidebar-toggle" className="sidebar-toggle">
            <i
              className="fa fa-commenting"
              title="See all the new thoughts"
              aria-hidden="true"
            ></i>
          </label>

          <div className="form-group">
            <form onSubmit={handleSubmit}>
              <input
                placeholder="Write your thoughts..."
                type="text"
                value={thought}
                required
                onChange={(e) => setThought(e.target.value)}
                disabled={isLoading}
              />
              <button type="submit" disabled={isLoading}>
                {isLoading ? "Sharing..." : "Share"}
              </button>
            </form>
          </div>

          <div className="flex__container">
            <div className="left">
              <div className="left__inside">
                {isLoading ? (
                  <p>Loading thoughts...</p>
                ) : thoughts.length === 0 ? (
                  <p>No thoughts available</p>
                ) : (
                  thoughts.map((thought) => (
                    <div
                      className="left__boxs close"
                      key={thought._id}
                      onClick={() => handleThoughtSelect(thought)}
                    >
                      <h4 className="owner">{thought.owner}</h4>
                      <p>{thought.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="right">
              <div className="right__inside">
                {selectedThought && (
                  <div className="right__sideBox">
                    <h1 className="topic">{selectedThought.text}</h1>
                    <div className="reply__container">
                      <h2>Replies:</h2>
                      <div className="replies">
                        {selectedThought?.replies
                          ?.filter((reply) => reply.visible === "show")
                          .map((reply, index) => (
                            <div className="replyprofile" key={index}>
                              <div
                                onClick={() =>
                                  handleOpenProfile({
                                    user: reply.user,
                                    userId: reply.userId,
                                  })
                                }
                                className="reply_pro"
                              >
                                <img src={reply.profile} alt="profileimg" />
                                <div className="name_flex">
                                  <div>
                                    <h2>{reply.user}</h2>
                                    <i className="fa fa-plus-circle"></i>
                                  </div>
                                  <span>
                                    {new Date(reply.createdAt).toLocaleString(
                                      "en-IN",
                                      {
                                        timeZone: "Asia/Kolkata",
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                      }
                                    )}
                                  </span>
                                </div>
                              </div>
                              <pre>{reply.text}</pre>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="replytextbox">
                      <textarea
                        placeholder="Write your reply..."
                        value={replyText[selectedThought._id] || ""}
                        onChange={(e) =>
                          handleReplyChange(selectedThought._id, e.target.value)
                        }
                        disabled={isLoading}
                      />
                      <button
                        onClick={() => handleReplySubmit(selectedThought._id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Posting..." : "Share"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {profileBox && (
                <div className="profile__box">
                  <div className="profile__box__inside">
                    <div className="profile__box__header">
                      <span></span>
                      <button
                        className="close__btn"
                        onClick={() => setProfileBox(false)}
                      >
                        X
                      </button>
                    </div>
                    <div className="profile__box__content">
                      <h2>{profileBox.user}</h2>
                      <button
                        className={getFriendButtonClass(profileBox.userId)}
                        onClick={() =>
                          handleAddFriend(profileBox.userId, profileBox.user)
                        }
                        disabled={
                          isLoading ||
                          profileBox.userId === userId ||
                          friendStatus.friendRequests.some(
                            (req) => req.userId === profileBox.userId
                          ) ||
                          friendStatus.friends.some(
                            (friend) => friend.userId === profileBox.userId
                          )
                        }
                      >
                        {isLoading
                          ? "Sending..."
                          : getFriendButtonText(profileBox.userId)}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;