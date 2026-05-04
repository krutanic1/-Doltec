import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import headerlogo from "../assets/headerlogo.png"
// import logo from "../assets/doltec2.png";
import ToggleComponent from "./ToggleComponent";

const Header = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [activeOption, setActiveOption] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [activeMobileMenuOption, setActiveMobileMenuOption] = useState(null);

  const toggleDropdown = (dropdownId) => {
    if (activeDropdown === dropdownId) {
      setActiveDropdown(null);
      setActiveOption(null);
    } else {
      setActiveDropdown(dropdownId);
      setActiveOption("Option1");
    }
  };

  const selectOption = (option) => {
    setActiveOption(option);
  };
  const toggleMobileMenu = () => {
    setShowMobileMenu((prev) => !prev);
  };

  const toggleMobileMenuOption = (optionId) => {
    setActiveMobileMenuOption((prev) => (prev === optionId ? null : optionId));
    
  };
  const location = useLocation();
  const noHeaderFooterRoutes = [
    "/",
    "/CompanyLogin",
    "/CompanyLoginWithOTP",
    "/CompanySignup",
    "/adminlogin",
    "/StudentLogIn",
    "/Loginwithotp",
    "/StudentSignUp",
    "/Home",
    "/chooseaplan",
    "/Joblist",
    "/AppliedStatus",
    "/Resume",
    "/Settings",
    "/HRLogin",
    "/HRHome",
    "/CompanyJoblist",
    "/JobApplications",
    "/InterviewProcess",
    "/SelectedCandidates",
    "/RejectedCandidates",
    "/HiredCandidates",
    "/Dashboard",
    "/dashboard",
    "/ManageThoughts",
    "/UpdateLandingPage",
    "/CompanyJobs",
    "/AssignedJobs",
    "/UserManagement",
    "/ContactUsResponse",
    "/CompanyOnboardList",
    "/selectaplan",
    "/CreateHR",
    "/HrPDashboard",
    "/Recruitment",
    "/CompanyDashboard",
    "/CompanyJobPost",
    "/CompanyInterviewProcess",
    "/CompanyHiredCandidates",
    "/CompanyRejectedCandidates",
    "/CompanyHRSelected",
    "/PrivateChats",
     "/CommunityDashboard",
    "/CommunityPrivateChat",
    "/CommunityLogin",
    "/CommunitySignup",
    "/CommunityPosts"

  ];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <>
      {showHeaderFooter && (
        <div id="header">
          <div className="navbar" style={{ boxShadow: "none" }}>
             <Link to="/ITServices"><img src={headerlogo} alt="" /></Link>
            <ul>
              <li onClick={() => toggleDropdown()}>
                <Link className=" hover:text-white" to="/ITServices">
                  {" "}
                  HOME
                </Link>
              </li>
              <li onClick={() => toggleDropdown("what_we_do")}>WHAT WE DO</li>
              <li onClick={() => toggleDropdown("who_we_are")}>WHO WE ARE</li>
              <li><Link to="/AllJobs">JOBS</Link></li>
              <li onClick={() => toggleDropdown()}>
                <Link className=" hover:text-white" to="/About">
                  {" "}
                  ABOUT US
                </Link>
              </li>
            </ul>
            <div className="hamburger"><i onClick={toggleMobileMenu} class="fa fa-bars" aria-hidden="true"></i></div>
            <div onClick={() => {toggleDropdown()}}>
              <Link to="/"> {" "} <ToggleComponent /> </Link>
            </div>
          </div>

          
          {showMobileMenu && (
            <div className="mobile-menu">
              <ul>
                <li onClick={toggleMobileMenu}>
                  <Link to="/ITServices">HOME</Link>
                </li>
                <li onClick={() => toggleMobileMenuOption("option2")}>
                  WHAT WE DO
                  {activeMobileMenuOption === "option2" && (
                    <ul>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Overview">
                        <span><i class="fa fa-caret-right"></i></span>  Overview 
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Industries">
                        <span><i class="fa fa-caret-right"></i></span> INDUSTRIES
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Services">
                        <span><i class="fa fa-caret-right"></i></span> SERVICES
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Product">
                        <span><i class="fa fa-caret-right"></i></span> PRODUCT AND PLATFORM
                      </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li onClick={() => toggleMobileMenuOption("option3")}>
                  WHO WE ARE
                  {activeMobileMenuOption === "option3" && (
                    <ul>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Mission">
                        <span><i class="fa fa-caret-right"></i></span> OUR MISSION
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Vission">
                        <span><i class="fa fa-caret-right"></i></span> OUR VISSION
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Project">
                        <span><i class="fa fa-caret-right"></i></span> OUR PROJECT
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/About">
                        <span><i class="fa fa-caret-right"></i></span> ABOUT US
                      </Link>
                      </li>
                    </ul>
                  )}
                </li>
                <li onClick={toggleMobileMenu}>
                <Link className=" hover:text-white" to="/About">
                  {" "}
                  ABOUT US
                </Link>
              </li>
                {/* <li onClick={() => toggleMobileMenuOption("option4")}>
                  INSIGHT
                  {activeMobileMenuOption === "option4" && (
                    <ul>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Insight1">
                        <span><i class="fa fa-caret-right"></i></span> INSIGHT 1
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Insight2">
                        <span><i class="fa fa-caret-right"></i></span> INSIGHT 2
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Insight3">
                        <span><i class="fa fa-caret-right"></i></span> INSIGHT 3
                      </Link>
                      </li>
                      <li onClick={toggleMobileMenu}>
                      <Link to="/Insight4">
                        <span><i class="fa fa-caret-right"></i></span> INSIGHT 4
                      </Link>
                      </li>
                    </ul>
                  )}
                </li> */}
              </ul>
            </div>
          )}

          {activeDropdown === "what_we_do" && (
            <div
              id="what_we_do"
              className="dropdown"
              onClick={() => toggleDropdown()}
            >
              <div className="option">
                <div className="dropdown_option">
                  <ul>
                    <li onMouseOver={() => selectOption("Option1")}>
                      {" "}
                      <Link to="/Overview">
                        {" "}
                        Overview <span>&#11162;</span>
                      </Link>{" "}
                    </li>
                    <li onMouseOver={() => selectOption("Option2")}>
                      {" "}
                      <Link to="/Industries">
                        Industries <span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option3")}>
                      {" "}
                      <Link to="/Services">
                        Services <span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option4")}>
                      {" "}
                      <Link to="/Product">
                        Product and Platform <span>&#11162;</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                {activeOption === "Option1" && (
                  <div className="option_content">
                    <h2>Doltec Consultancy Services — Bridging Talent with Opportunity</h2>
                    <p> At Doltec, we are not just matching jobs to resumes — we are architecting the future of talent acquisition and career growth. Positioned at the intersection of innovation and impact, Doltec Consultancy Services is redefining recruitment through a unified, tech-enabled platform. Whether you're a fast-scaling startup or an established enterprise, we provide precision hiring solutions tailored to your business goals. For job seekers — particularly students and early-career professionals — we offer a frictionless gateway to meaningful opportunities.</p>
                    <p>Our mission is to enable intelligent hiring and accelerate employability through data-driven matchmaking, industry-aligned assessments, and consultative talent strategies. Doltec is where potential meets purpose — empowering organizations to hire smarter and individuals to get hired faster.</p>
                  </div>
                )}
                {activeOption === "Option2" && (
                  <div className="option_content">
                    <h2>Sector-Specific Expertise. Cross-Industry Impact.</h2>
                     <p>Doltec Consultancy Services operates with a multi-industry focus, providing bespoke recruitment and staffing solutions across high-growth verticals. Our platform is designed to adapt to the evolving workforce demands of modern enterprises.</p>
                     <ol>
                      <li>Information Technology (IT) & Software Development</li>
                      <li>Financial Services & FinTech</li>
                      <li>Education & EdTech</li>
                      <li>Healthcare & Life Sciences</li>
                      <li>Real Estate</li>
                     </ol>
                  </div>
                )}
                {activeOption === "Option3" && (
                  <div className="option_content">
                    <h2>Consultative. Scalable. Results-Driven.</h2>
                    <p>Doltec offers a comprehensive suite of recruitment and talent advisory services, purpose-built to elevate hiring agility and workforce quality. Our service offerings include</p>
                    <ol>
                      <li>End-to-End Recruitment Process Outsourcing (RPO)</li>
                      <li>Campus Hiring & University Engagement Programs</li>
                      <li>Technical & Non-Technical Talent Acquisition</li>
                      <li>Job Postings & Employer Branding Solutions</li>
                      <li>Co-working Solutions</li>
                      <li>Rental Solutions</li>
                    </ol>
                  </div>
                )}
                {activeOption === "Option4" && (
                  <div className="option_content">
                    <h2>Your Digital Talent Ecosystem. All-in-One. Always-On.</h2>
                    <p>Doltec’s digital platform is a full-stack hiring ecosystem built for modern recruiters and career-driven individuals. Our intuitive interface and AI-driven backend streamline every touchpoint of the hiring journey — from job posting to offer rollout.</p>
                     <ol>
                      <li>Smart Job Posting with Dynamic Filters</li>
                      <li>Applicant Tracking & Workflow Automation</li>
                      <li>Integrated Video Interviewing Tools</li>
                      <li>Real-Time Analytics & Hiring Dashboards</li>
                     </ol>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeDropdown === "who_we_are" && (
            <div
              id="who_we_are"
              className="dropdown"
              onClick={() => toggleDropdown()}
            >
              <div className="option">
                <div className="dropdown_option">
                  <ul>
                    <li onMouseOver={() => selectOption("Option1")}>
                      <Link to="/Mission">
                        Our Mission <span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option2")}>
                      <Link to="/Vission">
                        Our Vission<span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option3")}>
                      <Link to="/Project">
                        Our Project<span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option4")}>
                      <Link to="/About">
                        About Us<span>&#11162;</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                {activeOption === "Option1" && (
                  <div className="option_content">
                    <h2>Empowering the Workforce of Tomorrow.</h2>
                     <p>At Doltec, our mission is to revolutionize the talent landscape by bridging the gap between academia and industry through intelligent, scalable, and human-centric solutions. We aim to empower organizations with top-tier talent while equipping students and job seekers with the skills, exposure, and guidance needed to thrive in the evolving professional world.</p>
                     <p>We don’t just enable employment—we build futures through purpose-driven partnerships, technology-led strategies, and outcome-focused execution.</p>
                  </div>
                )}
                {activeOption === "Option2" && (
                  <div className="option_content">
                    <h2>To Be the Premier Gateway Between Talent and Industry.</h2>
                    <p>
                     Our vision is to become the most trusted consultancy and career enablement platform globally—one that is synonymous with quality hiring, student empowerment, and digital-first recruitment innovation. We envision a world where every capable individual has direct access to the right opportunity, and every organization finds its ideal talent—seamlessly, strategically, and sustainably.
                    </p>
                  </div>
                )}
                {activeOption === "Option3" && (
                  <div className="option_content">
                    <h2>Doltec: A Unified Recruitment Ecosystem.</h2>
                    <p>Our flagship project, Doltec, is a next-gen recruitment and career enablement platform designed to digitally transform the hiring lifecycle. This platform serves dual stakeholders—companies seeking agile recruitment solutions and students or early-career professionals seeking direction, development, and deployment.</p>
                    <ol>
                      <li>A dynamic job board for companies to post openings and track applications.</li>
                      <li>AI-powered candidate matching based on skill, interest, and company culture.</li>
                      <li>Integrated campus hiring tools to engage with colleges and training institutes.</li>
                      <li>A student-focused portal with resume tools, interview prep, and placement drives.</li>
                    </ol>
                  </div>
                )}
                {activeOption === "Option4" && (
                  <div className="option_content">
                    <h2>Strategic Consultants. Digital Innovators. Talent Architects.</h2>
                     <p>Doltec Consultancy Services is a forward-thinking recruitment and talent advisory firm engineered to meet the workforce challenges of the digital era. We operate at the confluence of human capital strategy, education, and technology — creating seamless pathways from campus to corporate.</p>
                     <p>Founded with a commitment to excellence, our team comprises industry veterans, HR technologists, and career development experts who understand the unique dynamics of both employers and emerging professionals. From end-to-end hiring support to full-scale platform implementation, we deliver results that redefine success in the recruitment space.</p>
                     <strong>At Doltec, we don't just fill roles — we fulfill visions.</strong>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeDropdown === "insight" && (
            <div
              id="insight"
              className="dropdown"
              onClick={() => toggleDropdown()}
            >
              <div className="option">
                <div className="dropdown_option">
                  <ul>
                    <li onMouseOver={() => selectOption("Option1")}>
                      <Link to="/Insight1">
                        Overviews<span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option2")}>
                      <Link to="/Insight2">
                        Company Experiences<span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option3")}>
                      <Link to="/Insight3">
                        Students Review<span>&#11162;</span>
                      </Link>
                    </li>
                    <li onMouseOver={() => selectOption("Option4")}>
                      <Link to="/Insight4">
                        Share Your Thoughts<span>&#11162;</span>
                      </Link>
                    </li>
                  </ul>
                </div>
                {activeOption === "Option1" && (
                  <div className="option_content">
                    <h1>INSIGHT</h1>
                    <h3>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Est harum non voluptates enim possimus veniam vero
                      sapiente, cupiditate cumque? Unde officiis, aliquam
                      explicabo adipisci vel voluptas. Officia quia
                      necessitatibus itaque?
                    </h3>
                  </div>
                )}
                {activeOption === "Option2" && (
                  <div className="option_content">
                    <h1>INSIGHT</h1>
                    <h3>
                      Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                      Cumque ea quasi nostrum placeat soluta itaque, labore
                      nihil quaerat ab commodi? Quas libero placeat delectus
                      consequatur corporis rem ad consequuntur harum.
                    </h3>
                  </div>
                )}
                {activeOption === "Option3" && (
                  <div className="option_content">
                    <h1>INSIGHT</h1>
                    <h3>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Illum harum, cum nulla quos quia ipsa voluptatum, libero
                      cupiditate asperiores corrupti possimus. Illum eum harum
                      iste nemo sed laborum explicabo repellat commodi modi.
                      Consequatur dolore repudiandae amet perspiciatis ratione
                      autem! Facere adipisci distinctio mollitia ex velit
                      sapiente voluptatem omnis libero fuga.
                    </h3>
                  </div>
                )}
                {activeOption === "Option4" && (
                  <div className="option_content">
                    <h1>INSIGHT</h1>
                    <h3>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Vel soluta, pariatur ab voluptatibus possimus voluptates
                      quasi, libero, dolorum veniam corporis odio nesciunt quia
                      ipsam. Dolorum impedit beatae commodi sint quidem, officia
                      deserunt! Quod mollitia placeat rerum error repellendus
                      molestiae sequi, dolores, voluptatem sit praesentium iusto
                      voluptas at adipisci, est architecto nesciunt quos
                      consectetur omnis dolor! Neque repellat fugiat quo ipsum!
                    </h3>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
