import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

import './Style/Header.css'
import './Style/Footer.css'
// import './Style/DropDownPages.css'
import './Style/Contactus.css'
import './Style/ToggleComponent.css'
import './Style/Recruitment.css'
import './Style/StudentLogin.css'
import './Style/StudentSignUp.css'
import './Style/CompanyLogin.css'
import './Style/CompanySignup.css'
import './Style/HRLogin.css'
import './Style/StudentHeader.css'
import './Style/Resume.css'
import './Style/Settings.css'
import './Style/Admin.css'
import './Style/Adminlogin.css'
import './Style/Createhr.css'
import './Style/HRHome.css'
import './Style/HRHeader.css'
import './Style/CompanyJoblist.css'
import './Style/JobApplications.css'
import './Style/AdminContactresponse.css'
import './Style/CompanyJob.css'
import './Style/CompanyHeader.css'
import './Style/Landingpage.css'
import './Style/Joblist.css'
import './Style/AssignedJobs.css'
// import './Style/CompanyProfile.css'
import './Style/AdminCompanyJoblist.css'
import './Style/CompanyHRSelected.css'
import './Style/UserDashboard.css'
import './Style/AdminDashboard.css'
import './Style/Appliedjoblist.css'
import './Style/Overview.css'
import './Style/RejectedApplication.css'
import './Style/CompanyInterviewProcess.css'
import './Style/CompanyRejectedCandidates.css'
import './Style/InterviewProcessHR.css'
import './Style/CompanyHiredCandidates.css';
import './Style/HrRejectedCandidate.css';
import "./Style/Chooseaplan.css"
import "./Style/Selectaplan.css"
import "./Style/PageNotFound.css"
import "./Style/PrivateChats.css"

import "./Style/Hero_Landingpage.css"
import "./Style/Howitworks_landingpage.css"
import "./Style/FeatureRoles_landingpage.css"
import "./Style/PlatformFeatures_landingpage.css"
import "./Style/SuccessStories_landingpage.css"
import "./Style/Resources_landingpage.css"
import "./Style/Footer_landingpage.css"
import "./Style/Resources.css"
import "./Style/Landing.css"
import "./Style/CommunitySection.css"

import "./Style/AllJobsPage.css"
import "./Style/Pricing.css"

import "./Style/Loginwithotp.css"
import "./Style/CommunityDashboard.css"
import "./Style/CommunityLogin.css"
import "./Style/CommunitySignUp.css"
import "./Style/CommunityPosts.css"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="960662701648-tdvrafib87gurrcgq9263oi1k2kuppqb.apps.googleusercontent.com">
      <App />
      </GoogleOAuthProvider>
  </StrictMode>
)
