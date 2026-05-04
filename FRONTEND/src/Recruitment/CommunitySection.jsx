import {Link} from 'react-router-dom'

export default function CommunitySection() {
  return (
    <div id="community_section_landingpage">
        <section className="community-section">
      <div className="community-container">
        {/* Left Content */}
        <div className="community-content">
          <h2 className="community-title">Be Part of Something Bigger</h2>
          <p className="community-description">
            Welcome to a space built for <strong>open conversations, real
            connections, and meaningful growth</strong>. Here, you can share
            your thoughts, exchange ideas, and learn from diverse perspectives.  
            But we go beyond conversations send <strong>friend requests</strong>,
            connect with like-minded people, and enjoy <strong>private,
            encrypted chats</strong> that keep your discussions safe.  
          </p>
          <p className="community-highlight">
            It’s more than just a forum. It’s your place to <strong>connect,
            collaborate, and grow together</strong>.
          </p>
          <ul className="community-features">
            <li>✨ Share your stories, insights & questions</li>
            <li>🤝 Build genuine connections with friend requests</li>
            <li>💬 Private, secure one-to-one chats</li>
            <li>🌍 A growing network of curious minds like you</li>
          </ul>
          <div className="community-buttons">
            <Link to="/CommunityLogin" className="community-btn">
            Join Now
          </Link>
          <Link to="/community" className="community-btn">
            Explore Community
          </Link>
        </div>

        </div>

        {/* Right Illustration */}
        <div className="community-image">
          <img
            src="https://i.pinimg.com/736x/e0/7f/45/e07f4544a6d59ca95cba20e24eefe8e0.jpg"
            alt="Community illustration"
          />
        </div>
      </div>
    </section>
    </div>
  );
}
