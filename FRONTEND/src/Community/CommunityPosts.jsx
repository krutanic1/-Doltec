import axios from "axios";
import API from "../API";
import { useState, useEffect } from "react";

const CommunityPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);

  const fetchPosts = async () => {
    const data = localStorage.getItem("com-user");
    const userData = data ? JSON.parse(data) : null;
    const userId = userData ? userData.userId : null;

    setLoading(true);
    try {
      const response = await axios.get(`${API}/communityposts/${userId}`);
      setPosts(
        Array.isArray(response.data)
          ? response.data
          : response.data.thoughts || []
      );
    } catch (error) {
      console.error("Error fetching community posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
     <div id="community-posts">
        <div className="faq-container">
      {loading ? (
        <div className="faq-skeleton-container">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="faq-skeleton-item">
              <div className="skeleton-question"></div>
              <div className="skeleton-answer"></div>
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p>No community posts available.</p>
      ) : (
        posts.map((post, index) => {
          const question = post.text || "No question text";
          const firstReply =
            post.replies && post.replies.length > 0 ? post.replies[0] : null;
          const answer = firstReply ? firstReply.text : "No replies yet.";

          return (
            <div key={index} className="faq-item">
              <div className="faq-question" onClick={() => toggle(index)}>
                 <span className="number">{index + 1}.</span>
                 <div className="question-text">
                      <h3>{question}</h3>
                      <span>{openIndex === index ? "▲" : "▼"}</span>
                 </div>
              </div>
              {openIndex === index && (
                <div className="faq-answer">
                  <p>{answer}</p>
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
     </div>
  );
};

export default CommunityPosts;
