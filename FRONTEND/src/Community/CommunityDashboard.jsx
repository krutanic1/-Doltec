import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import API from '../API';


const CommunityDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [friendRequests, setFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState(null);

  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('com-user');
    
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  
      setUserData(parsedUser);
      if (!parsedUser.userId || !parsedUser.name ) {
        console.error('User not logged in: userId or name missing', parsedUser);
        navigate('/CommunityLogin');
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      navigate('/CommunityLogin');
    }
  }, [navigate]);

  // Fetch friend requests and friends
  const fetchFriendData = async () => {
    if (!userData.userId) return;
    setIsLoading(true);
    try {
    
      const response = await axios.get(`${API}/checkfriend/${userData.userId}`);
      setFriendRequests(response.data.friendRequests || []);
      setFriends(response.data.friends || []);
    } catch (error) {
      console.error('Error fetching friend data:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Error fetching friend data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userData.userId) {
      fetchFriendData();
    }
  }, [userData.userId]);

    const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileSizeKB = selectedFile.size / 1024;
      if (fileSizeKB > 60) {
        alert("File size must be under 50KB!");
        return;
      }
      setFile(selectedFile);
    }
  };

    const handleUpload = async (e) => {
    e.preventDefault();
        const data = localStorage.getItem("com-user");
    const userData = data ? JSON.parse(data) : null;
    const userId = userData ? userData.userId : null;
    if (!file) {
      alert("Please select a file.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await axios.post(`${API}/communityprofile`,{image: reader.result , userId});
        if (response.status === 200) {
          alert("Profile photo updated successfully!");
          setFile(null);
        } else {
          alert("Upload failed. Please try again.");
        }
      } catch (error) {
        console.error("Upload Error:", error);
        alert("Error uploading photo.");
      }
    };

    reader.readAsDataURL(file);
  };



  return (
    <div className="dashboard-container">
      {/* Main Content */}
      <div className="main-content">
        <div className="card-grid">
          {/* Profile Card */}
          <div className="card">
            <h2 className="card-title">Your Profile</h2>
             <form onSubmit={handleUpload} className="profile-photo-form">
              <div className="profile-info">
              <img
                src={userData.profile || '/default-profile.png'}
                alt="profile"
                className="profile-image"
              />
              <label className="overlay-label">
                  <i className="fa fa-edit icon-style"></i>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              <div>
                <p className="profile-name">{userData.name || 'N/A'}</p>
                <p className="profile-email">{userData.email || 'N/A'}</p>
              </div>
            </div>
              <button>Upload</button>
             </form>
            <div className="profile-actions">
              {/* <Link to="/Community" className="profile-edit-button">
                Edit Profile
              </Link> */}
              {/* <button className="logout-button" onClick={handleLogout}>
                Logout
              </button> */}
            </div>
          </div>

          <div className="card">
            <h2 className="card-title">Pending Friend Requests</h2>
            {isLoading ? (
              <p className="loading-text">Loading...</p>
            ) : friendRequests.length > 0 ? (
              <ul className="list">
                {friendRequests.map((request) => (
                  <li key={request.userId} className="list-item">
                    <span>{request.name} (Pending)</span>
                    <Link to="/CommunityPrivateChat" className="link">
                      View Request
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No pending friend requests</p>
            )}
          </div>

          <div className="card">
            <h2 className="card-title">Your Friends</h2>
            {isLoading ? (
              <p className="loading-text">Loading...</p>
            ) : friends.length > 0 ? (
              <ul className="list">
                {friends.map((friend) => (
                  <li key={friend.userId} className="list-item">
                    <span>{friend.name}</span>
                    <Link to="/CommunityPrivateChat" className="link">
                      Message
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-data">No friends yet</p>
            )}
          </div>

        </div>

        <div className="cta-container">
          <Link to="/Community" className="cta-button">
            Find Friends & Share Thoughts
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default CommunityDashboard;