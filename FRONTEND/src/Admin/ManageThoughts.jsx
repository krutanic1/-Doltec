import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../API";

const ManageThoughts = () => {
  const [thoughts, setThoughts] = useState([]);
  // const [replyText, setReplyText] = useState({});
  const [selectedThought, setSelectedThought] = useState(null);

  const fetchThoughts = async () => {
    try {
      const response = await axios.get(`${API}/getthoughts`);
      setThoughts(response.data);
    } catch (error) {
      console.error("Error fetching thoughts:", error);
    }
  };

  useEffect(() => {
    fetchThoughts();
  }, []);

  useEffect(() => {
    if (thoughts && thoughts.length > 0) {
      setSelectedThought(thoughts[0]);
    }
  }, [thoughts]);

  const handleThoughtSelect = (thought) => {
    setSelectedThought(thought);
  };


  const handleChangeRepliesVisible = async (thoughtId, replyIndex , visibilty) => {
    // console.log(thoughtId , visibilty ,replyIndex )
    try {
      const response = await axios.put(
        `${API}/changerepliesvisibilty/${thoughtId}/replies/${replyIndex}` ,{visibilty}
      );
      alert(`${visibilty} replied`);
      setThoughts((prev) =>
        prev.map((thought) =>
          thought._id === thoughtId ? response.data : thought
        )
      );
    } catch (error) {
      console.error("Error showing reply:", error);
    }
  };
 

  const handleChangeVisibilty = async (thoughtId, visible) => {
    try {
      const response = await axios.put(`${API}/changevisible/${thoughtId}`, {
        visible,
      });
      alert("visibilty changed");
      setThoughts((prev) =>
        prev.map((thought) =>
          thought._id === thoughtId ? response.data : thought
        )
      );
    } catch (error) {
      console.error("Error showing thought:", error);
    }
  };

  return (
    <div id="managethoughts">
      <div className="share__container">
        <div className="flex__container">
          {/* Left Side: Thoughts List */}
          <div className="left">
            <div className="left__inside">
              {thoughts.map((thought) => (
                <div
                  className="left__boxs"
                  key={thought._id}
                  onClick={() => handleThoughtSelect(thought)}
                >
                  <p>{thought.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Selected Thought and Replies */}
          <div className="right">
            <div className="right__inside">
              {selectedThought && (
                <div className="right__sideBox">
                  <span>{selectedThought.text}</span>
                  <span className="flex__icons">
                    <i
                      onClick={() =>
                        handleChangeVisibilty(selectedThought._id, "show")
                      }
                      title="Show"
                      className="fa fa-eye"
                      aria-hidden="true"
                      style={{color: `${selectedThought.visible === "show" ? "green" : "white" }`}}

                    ></i>
                    <i
                      onClick={() =>
                        handleChangeVisibilty(selectedThought._id, "hide")
                      }
                      title="Hide"
                      className="fa fa-eye-slash"
                      aria-hidden="true"
                      style={{color: `${selectedThought.visible === "hide" ? "red" : "white" }`}}
                    ></i>
                  </span>
                  <div className="reply__container">
                    <h2>replies:</h2>
                    <div className="replies">
                      {selectedThought.replies.map((reply, index) => (
                        <div className="replyprofile" key={index}>
                          <i class="fa fa-user" aria-hidden="true"></i>
                          <span>
                            {new Date(reply.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              dateStyle: "medium",
                              timeStyle: "short",
                            })}{" "}
                          </span>
                          <pre>{reply.text}</pre>
                          <span id="flex__hideshow">
                            <i
                              title="Show"
                              class="fa fa-eye"
                              aria-hidden="true"
                              style={{color: `${reply.visible === "show" ? "green" : "white" }`}}
                              onClick={() => handleChangeRepliesVisible(selectedThought._id , index , "show")}
                            ></i>
                            <i
                              title="Hide"
                              class="fa fa-eye-slash"
                              aria-hidden="true"
                              style={{color: `${reply.visible === "hide" ? "red" : "white" }`}}
                              onClick={() => handleChangeRepliesVisible(selectedThought._id , index , "hide")}
                            ></i>
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageThoughts;
