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
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", color: "#0f172a", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ marginBottom: "30px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
            Manage Thoughts
          </h2>
          <p style={{ color: "#64748b", marginTop: "8px", fontSize: "15px" }}>Review, show, and hide community thoughts and replies.</p>
        </div>

        <div style={{ display: "flex", gap: "30px", flexDirection: "row", alignItems: "flex-start" }}>
          
          {/* Left Side: Thoughts List */}
          <div style={{ flex: "1 1 35%", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", overflow: "hidden", border: "1px solid #e2e8f0", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ padding: "20px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f1f5f9", fontWeight: "600", color: "#334155" }}>
              All Thoughts
            </div>
            <div>
              {thoughts.map((thought) => (
                <div
                  key={thought._id}
                  onClick={() => handleThoughtSelect(thought)}
                  style={{
                    padding: "20px",
                    borderBottom: "1px solid #f1f5f9",
                    cursor: "pointer",
                    backgroundColor: selectedThought?._id === thought._id ? "#f8fafc" : "#ffffff",
                    borderLeft: selectedThought?._id === thought._id ? "4px solid #3b82f6" : "4px solid transparent",
                    transition: "background-color 0.2s"
                  }}
                  onMouseEnter={(e) => { if (selectedThought?._id !== thought._id) e.currentTarget.style.backgroundColor = "#f8fafc"; }}
                  onMouseLeave={(e) => { if (selectedThought?._id !== thought._id) e.currentTarget.style.backgroundColor = "#ffffff"; }}
                >
                  <p style={{ margin: 0, fontSize: "15px", color: "#334155", lineHeight: "1.5", display: "-webkit-box", WebkitLineClamp: "3", WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {thought.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Selected Thought and Replies */}
          <div style={{ flex: "1 1 65%", backgroundColor: "#ffffff", borderRadius: "12px", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)", border: "1px solid #e2e8f0", padding: "30px" }}>
            {selectedThought ? (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
                  <div style={{ fontSize: "18px", fontWeight: "500", color: "#0f172a", lineHeight: "1.6", flex: 1, paddingRight: "20px" }}>
                    "{selectedThought.text}"
                  </div>
                  <div style={{ display: "flex", gap: "10px", backgroundColor: "#f1f5f9", padding: "6px 12px", borderRadius: "20px" }}>
                    <i
                      onClick={() => handleChangeVisibilty(selectedThought._id, "show")}
                      title="Show"
                      className="fa fa-eye"
                      style={{ cursor: "pointer", fontSize: "16px", color: selectedThought.visible === "show" ? "#16a34a" : "#94a3b8", transition: "color 0.2s" }}
                    ></i>
                    <div style={{ width: "1px", backgroundColor: "#cbd5e1" }}></div>
                    <i
                      onClick={() => handleChangeVisibilty(selectedThought._id, "hide")}
                      title="Hide"
                      className="fa fa-eye-slash"
                      style={{ cursor: "pointer", fontSize: "16px", color: selectedThought.visible === "hide" ? "#ef4444" : "#94a3b8", transition: "color 0.2s" }}
                    ></i>
                  </div>
                </div>

                <div style={{ marginTop: "40px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#475569", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "20px" }}>
                    Replies ({selectedThought.replies?.length || 0})
                  </h3>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    {selectedThought.replies?.map((reply, index) => (
                      <div key={index} style={{ backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "20px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#64748b", fontSize: "13px", fontWeight: "500" }}>
                            <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="fa fa-user" style={{ fontSize: "12px", color: "#94a3b8" }}></i>
                            </div>
                            {new Date(reply.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" })}
                          </div>
                          
                          <div style={{ display: "flex", gap: "10px" }}>
                            <i
                              title="Show"
                              className="fa fa-eye"
                              style={{ cursor: "pointer", fontSize: "14px", color: reply.visible === "show" ? "#16a34a" : "#cbd5e1", transition: "color 0.2s" }}
                              onClick={() => handleChangeRepliesVisible(selectedThought._id, index, "show")}
                            ></i>
                            <i
                              title="Hide"
                              className="fa fa-eye-slash"
                              style={{ cursor: "pointer", fontSize: "14px", color: reply.visible === "hide" ? "#ef4444" : "#cbd5e1", transition: "color 0.2s" }}
                              onClick={() => handleChangeRepliesVisible(selectedThought._id, index, "hide")}
                            ></i>
                          </div>
                        </div>
                        
                        <div style={{ fontSize: "15px", color: "#334155", lineHeight: "1.5", whiteSpace: "pre-wrap", fontFamily: "inherit" }}>
                          {reply.text}
                        </div>
                      </div>
                    ))}
                    {(!selectedThought.replies || selectedThought.replies.length === 0) && (
                      <div style={{ color: "#94a3b8", fontStyle: "italic", textAlign: "center", padding: "20px 0" }}>
                        No replies yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "300px", color: "#94a3b8" }}>
                <i className="fa fa-comments-o" style={{ fontSize: "48px", marginBottom: "16px", color: "#e2e8f0" }}></i>
                <p style={{ fontSize: "16px" }}>Select a thought to view details and replies.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageThoughts;
