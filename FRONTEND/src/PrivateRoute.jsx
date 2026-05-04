import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export const PrivateRoute = ({ children }) => {
  const token = Cookies.get("authToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const HrPrivateRoute = ({ children }) => {
  const token = Cookies.get("hrToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const CompanyPrivateRoute = ({ children }) => {
  const token = Cookies.get("companyToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export const AdminPrivateRoute = ({ children }) => {
  const token = Cookies.get("adminToken");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
};


export const CommunityPrivateRoute = ({ children }) => {
  const communityUser = localStorage.getItem("com-user");
  if (!communityUser) {
    return <Navigate to="/CommunityLogin" replace />;
  }
  try {
    const parsedUser = JSON.parse(communityUser);
    if (!parsedUser.userId || !parsedUser.email) {
      localStorage.removeItem("com-user");
      return <Navigate to="/CommunityLogin" replace />;
    }
    return children;
  } catch (error) {
    localStorage.removeItem("com-user");
    return <Navigate to="/CommunityLogin" replace />;
  }
};