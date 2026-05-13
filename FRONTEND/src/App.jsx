import React from 'react'
import { BrowserRouter,Routes, Route, useLocation} from "react-router-dom";

import Header from './Components/Header'
import ITServices from './Components/ITServices';
import Footer from './Components/Footer'
import WhatwedoOverview from './Pages/Overview';
import WhatwedoIndustries from './Pages/Industries';
import WhatwedoServices from './Pages/Services';
import WhatwedoProduct from './Pages/Product';
import WhoweareMission from './Pages/Mission';
import WhoweareVission from './Pages/Vission';
import WhoweareProject from './Pages/Project';
import WhoweareAbout from './Pages/About';
import Insight1 from './Pages/Insight1';
import Insight2 from './Pages/Insight2';
import Insight3 from './Pages/Insight3';
// import Insight4 from './Pages/Insight4';
import Community from './Pages/Community';
import ContactUs from './Components/ContactUs';

import Recruitment from './Recruitment/Recruitment';

import StudentLogIn from './Students/StudentLogin';

import StudentSignUp from './Students/StudentSignUp';
import Home from './Students/Home';
import StudentHeader from './Students/StudentHeader';
import PrivateChats from './Students/PrivateChats';
import Joblist from './Students/Joblist';
import AppliedStatus from './Students/AppliedStatus';
import Resume from './Students/Resume';
import Settings from './Students/Settings';
import Chooseaplan from './Students/Chooseaplan';

import CompanyLogin from './Company/CompanyLogin';
import CompanySignup from './Company/CompanySignup';


import HRLogin from './Hr/HRLogin';
import HRHome from './Hr/HRHome';
import HRHeader from './Hr/HRHeader';
// import CompanyJoblist from './Hr/companyJobList';
import CompanyJoblist from './Hr/CompanyJoblist';
import JobApplications from './Hr/JobApplications';
import HiredCandidates from './Hr/HiredCandidates';
import RejectedCandidates from './Hr/RejectedCandidates';
import SelectedCandidates from './Hr/SelectedCandidates';
import InterviewProcess from './Hr/InterviewProcess';




import AdminHeader from './Admin/AdminHeader';
// import Adminlogin from './Admin/AdminLogin';
import Adminlogin from './Admin/Adminlogin';
import Createhr from './Admin/Createhr';
import AssignedJob from './Admin/AssignedJob';
import CompanyJobs from './Admin/CompanyJobs';
import UserManagement from './Admin/UserManagement';
import CompanyOnboardList from './Admin/CompanyOnboardList';
import ContactUsResponse from './Admin/ContactUsResponse';
import Dashboard from './Admin/Dashboard';
import ManageThoughts from './Admin/ManageThoughts';
import UpdateLandingPage from './Admin/UpdateLandingPage';


import CompanyHeader from './Company/CompanyHeader';
import CompanyDashboard from './Company/CompanyDashboard';
import CompanyJobPost from './Company/CompanyJobPost';
import CompanyInterviewProcess from './Company/CompanyInterviewProcess';
import CompanyHiredCandidates from './Company/CompanyHiredCandidates';
import CompanyHRSelected from './Company/CompanyHRSelected';
import SubscriptionDialog from './Company/SubscriptionDialog';

import ScrollToTop from './ScrollToTop';

import {PrivateRoute} from './PrivateRoute';
import { HrPrivateRoute } from './PrivateRoute';
import { CompanyPrivateRoute } from './PrivateRoute';
import { AdminPrivateRoute } from './PrivateRoute';
import PageNotFound from './Components/PageNotFound';
import PrivacyPolicy from './Pages/PrivacyProlicy';
import RefundCancellationPolicy from './Pages/RefundCancellationPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import Resources from './Pages/Resources';
import AllJobsPage from './Pages/AllJobs';
import Pricing from './Pages/Pricing';
import RealEstateApp from './real-estate/RealEstateApp';


import Loginwithotp from './Students/Loginwithotp';
import CompanyLoginWithOTP from './Company/CompanyLoginWithOTP';

import CommunitySignup from './Community/CommunitySignup';
import CommunityLogin from './Community/CommunityLogin';
import CommunityDashboard from './Community/CommunityDashboard';
import CommunityHeader from './Community/CommunityHeader';
import { CommunityPrivateRoute } from './PrivateRoute';
import CommunityPrivateChat from './Community/CommunityPrivateChats';
import CompanyOnboard from './Hr/CompanyOnboard';
import CommunityPosts from './Community/CommunityPosts';
import AdminRealEstate from './Admin/AdminRealEstate';







const App = () => {
  return (
    <BrowserRouter>
      <AppContent />
      </BrowserRouter>
  );
};


const AppContent = () => {
  const location = useLocation();

  const itHeader = [
    "/itservices",
    "/overview",
    "/industries",
    "/services",
    "/product",
    "/mission",
    "/vission",
    "/project",
    "/about",
    "/insight1",
    "/insight2",
    "/insight3",
    "/community",
    "/contactus",
    "/privacypolicy",
    "/refundcancellationpolicy",
    "/termsandconditions",
    "/resources",
    "/alljobs",
    "/pricing",
    "/real-estate",

  ];

  const studentHeader = [
    "/home",
    "/settings",
    "/resume",
    "/appliedstatus",
    "/joblist",
    "/chooseaplan",
    "/privatechats",
  ];
  const adminHeader = [
    "/dashboard",
    "/createhr",
    "/managethoughts",
    "/updatelandingpage",
    "/companyjobs",
    "/assignedjobs",
    "/usermanagement",
    "/contactusresponse",
    "/companyonboardlist",
    "/adminrealestate",

  ];
  const hrHeader = [
    "/hrhome",
    "/companyjoblist",
    "/jobapplications",
    "/interviewprocess",
    "/selectedcandidates",
    "/rejectedcandidates",
    "/hiredcandidates",
    "/companyonboard",
     
    
  ];
  const companyHeaderPaths = [
    "/companydashboard",
    "/companyjobpost",
    "/companyinterviewprocess",
    "/companyhiredcandidates",
    "/companyhrselected",
     "/subscriptiondialog",
  ];
    const communityHeaderPaths = [
    "/communitydashboard",
    "/communityprivatechat",
    "/communityposts",
  ];  


   
  return (
    <div>

        
        {itHeader.includes(location.pathname.toLowerCase()) && (<Header/>)}
        {studentHeader.includes(location.pathname.toLowerCase()) && (<StudentHeader/>)}
        {adminHeader.includes(location.pathname.toLowerCase()) && (<AdminHeader/>)}
        {hrHeader.includes(location.pathname.toLowerCase()) && (<HRHeader/>)}
        {companyHeaderPaths.includes(location.pathname.toLowerCase()) && <CompanyHeader/>}
          {communityHeaderPaths.includes(location.pathname.toLowerCase()) && <CommunityHeader/>}
        <ScrollToTop/>
        <Routes>
          <Route path="/ITServices" element={<ITServices/>} />
          <Route path="/Overview" element={<WhatwedoOverview/>} />
          <Route path="/Industries" element={<WhatwedoIndustries/>} />
          <Route path="/Services" element={<WhatwedoServices/>} />
          <Route path="/Product" element={<WhatwedoProduct/>} />
          <Route path="/Mission" element={<WhoweareMission/>} />
          <Route path="/Vission" element={<WhoweareVission/>} />
          <Route path="/Project" element={<WhoweareProject/>} />
          <Route path="/About" element={<WhoweareAbout/>} />
          <Route path="/Insight1" element={<Insight1/>} />
          <Route path="/Insight2" element={<Insight2/>} />
          <Route path="/Insight3" element={<Insight3/>} />
          <Route path="/Community" element={<Community/>} />
          <Route path="/ContactUs" element={<ContactUs/>} />
          <Route path="/PrivacyPolicy" element={<PrivacyPolicy/>} />
          <Route path="/RefundCancellationPolicy" element={<RefundCancellationPolicy/>} />
          <Route path="/TermsAndConditions" element={<TermsAndConditions/>} />
          <Route path="/Resources" element={<Resources/>} />
          <Route path="/AllJobs" element={<AllJobsPage/>} />
          <Route path="/Pricing" element={<Pricing/>} />
          <Route path="/real-estate/*" element={<RealEstateApp/>} />



          <Route path="*" element={<PageNotFound/>} />
         


          {/* recruitment start */}
          <Route path="/" element={<Recruitment/>} />

          {/* Student */}
          <Route path="/StudentLogIn" element={<StudentLogIn/>} />
          <Route path="/Loginwithotp" element={<Loginwithotp/>} />
          <Route path="/StudentSignUp" element={<StudentSignUp/>} />
          <Route path="/Home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/Joblist" element={<PrivateRoute><Joblist/></PrivateRoute>} />
          <Route path="/AppliedStatus" element={<PrivateRoute><AppliedStatus/></PrivateRoute>} />
          <Route path="/Resume" element={<PrivateRoute><Resume/></PrivateRoute>} />
          <Route path="/Settings" element={<PrivateRoute><Settings/></PrivateRoute>} />
          <Route path="/Chooseaplan" element={<PrivateRoute><Chooseaplan/></PrivateRoute>} />
          <Route path="/PrivateChats" element={<PrivateRoute><PrivateChats/></PrivateRoute>} />



          {/* company */}
          <Route path="/CompanyLogin" element={<CompanyLogin/>} />
          <Route path="/CompanyLoginWithOTP" element={<CompanyLoginWithOTP/>} />
          <Route path="/CompanySignup" element={<CompanySignup/>} />
          <Route path="/CompanyDashboard" element={<CompanyPrivateRoute><CompanyDashboard/></CompanyPrivateRoute>} />
          {/* <Route path="/Selectaplan" element={<CompanyPrivateRoute><Selectaplan/></CompanyPrivateRoute>} /> */}
          <Route path="/CompanyJobPost" element={<CompanyPrivateRoute><CompanyJobPost/></CompanyPrivateRoute>} />
          <Route path="/CompanyInterviewProcess" element={<CompanyPrivateRoute><CompanyInterviewProcess/></CompanyPrivateRoute>} />
          <Route path="/CompanyHiredCandidates" element={<CompanyPrivateRoute><CompanyHiredCandidates/></CompanyPrivateRoute>} />
          <Route path="/CompanyHRSelected" element={<CompanyPrivateRoute><CompanyHRSelected/></CompanyPrivateRoute>} />
           <Route path="/SubscriptionDialog" element={<CompanyPrivateRoute><SubscriptionDialog/></CompanyPrivateRoute>} />


            {/* HR */}
          <Route path="/HRLogin" element={<HRLogin/>} />
          <Route path="/HRHome" element={<HrPrivateRoute><HRHome/></HrPrivateRoute>} />
          <Route path="/CompanyJoblist" element={<HrPrivateRoute><CompanyJoblist/></HrPrivateRoute>} />
          <Route path="/JobApplications" element={<HrPrivateRoute><JobApplications/></HrPrivateRoute>} />
          <Route path="/HiredCandidates" element={<HrPrivateRoute><HiredCandidates/></HrPrivateRoute>} />
          <Route path="/RejectedCandidates" element={<HrPrivateRoute><RejectedCandidates/></HrPrivateRoute>} />
          <Route path="/SelectedCandidates" element={<HrPrivateRoute><SelectedCandidates/></HrPrivateRoute>} />
          <Route path="/InterviewProcess" element={<HrPrivateRoute><InterviewProcess/></HrPrivateRoute>} />
          <Route path="/CompanyOnboard" element={<HrPrivateRoute><CompanyOnboard/></HrPrivateRoute>} />
         

          {/* Admin */}
          <Route path="/Adminlogin" element={<Adminlogin/>} />
          <Route path="/Createhr" element={<AdminPrivateRoute><Createhr/></AdminPrivateRoute>} />
          <Route path="/Dashboard" element={<AdminPrivateRoute><Dashboard/></AdminPrivateRoute>} />
          <Route path="/ManageThoughts" element={<AdminPrivateRoute><ManageThoughts/></AdminPrivateRoute>} />
          <Route path="/UpdateLandingPage" element={<AdminPrivateRoute><UpdateLandingPage/></AdminPrivateRoute>}/>
          <Route path="/CompanyJobs" element={<AdminPrivateRoute><CompanyJobs/></AdminPrivateRoute>}/>
          <Route path="/AssignedJobs" element={<AdminPrivateRoute><AssignedJob/></AdminPrivateRoute>}/>
          <Route path="/UserManagement" element={<AdminPrivateRoute><UserManagement/></AdminPrivateRoute>}/>
          <Route path="/CompanyOnboardList" element={<AdminPrivateRoute><CompanyOnboardList/></AdminPrivateRoute>}/>
          <Route path="/ContactUsResponse" element={<AdminPrivateRoute><ContactUsResponse/></AdminPrivateRoute>}/>
          <Route path="/AdminRealEstate" element={<AdminPrivateRoute><AdminRealEstate/></AdminPrivateRoute>}/>

            {/* community */}
          <Route path="/CommunitySignup" element={<CommunitySignup/>} />
          <Route path="/CommunityLogin" element={<CommunityLogin/>} />
          <Route path="/CommunityDashboard" element={<CommunityPrivateRoute><CommunityDashboard/></CommunityPrivateRoute>} />
          <Route path="/CommunityPrivateChat" element={<CommunityPrivateRoute><CommunityPrivateChat/></CommunityPrivateRoute>} />
          <Route path="/CommunityPosts" element={<CommunityPrivateRoute><CommunityPosts/></CommunityPrivateRoute>} />

        </Routes>
        <Footer/> 
    </div>
  )
}

export default App
