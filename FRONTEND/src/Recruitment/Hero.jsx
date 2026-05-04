import React, { useCallback, useId, useState } from "react";
import { Link } from "react-router-dom";

export default function Hero() {
  const [audience, setAudience] = useState("students");
  const tablistId = useId();

  const onKeyDown = useCallback(
    (e) => {
      const order = ["students", "companies"];
      const idx = order.indexOf(audience);
      if (e.key === "ArrowRight") {
        setAudience(order[(idx + 1) % order.length]);
      } else if (e.key === "ArrowLeft") {
        setAudience(order[(idx - 1 + order.length) % order.length]);
      }
    },
    [audience]
  );

  return (
    <div id="hero_landingpage">
      <section aria-labelledby="hero-title" className="hero">
        <div className="hero-container">
          <div className="hero-grid">
            {/* Copy */}
            <div>
              <h1 id="hero-title" className="hero-title">
                Launch your career. Find the right talent.
              </h1>
              <p className="hero-subtitle">
                Students discover jobs and internships. Companies hire emerging
                talent—fast.
              </p>

              {/* Tabs */}
              <div
                role="tablist"
                aria-label="Select audience"
                id={tablistId}
                className="hero-tabs"
                onKeyDown={onKeyDown}
              >
                <HeroTab
                  isActive={audience === "students"}
                  onClick={() => setAudience("students")}
                  tabId="tab-students"
                  panelId="panel-students"
                >
                  For Students
                </HeroTab>
                <HeroTab
                  isActive={audience === "companies"}
                  onClick={() => setAudience("companies")}
                  tabId="tab-companies"
                  panelId="panel-companies"
                >
                  For Companies
                </HeroTab>
              </div>

              {/* Panels */}
              <div className="hero-panel">
                {audience === "students" ? (
                  <div
                    role="tabpanel"
                    id="panel-students"
                    aria-labelledby="tab-students"
                  >
                    <p className="panel-text">
                      Build one profile. Apply everywhere. Show skills, not just
                      GPA.
                    </p>
                    <div className="panel-buttons">
                      {/* <button className="btn-primary">Browse internships</button> */}
                      <button className="btn-outline">
                        <Link to="/StudentLogIn">Create profile</Link>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    role="tabpanel"
                    id="panel-companies"
                    aria-labelledby="tab-companies"
                  >
                    <p className="panel-text">
                      Hire future-ready talent. Reduce time-to-hire with smart
                      matches.
                    </p>
                    <div className="panel-buttons">
                      <button className="btn-primary">
                        <Link to="/CompanyLogin">Post a job</Link>
                      </button>
                      {/* <button className="btn-outline">Explore candidates</button> */}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Visual */}
            <div className="hero-image-wrapper">
              <img
                src="https://i.pinimg.com/1200x/f7/50/f5/f750f5a3ddeab2e38cf063a112e27893.jpg"
                alt="Students and companies collaborating through the platform"
                className="hero-image"
              />
            </div>
          </div>
        </div>
        <div className="check_price">
          <button>
            <Link to="/Pricing">Check Pricing</Link>
          </button>
        </div>
      </section>
    </div>
  );
}

function HeroTab({ isActive, onClick, tabId, panelId, children }) {
  return (
    <button
      role="tab"
      id={tabId}
      aria-controls={panelId}
      aria-selected={isActive}
      className={`hero-tab ${isActive ? "active" : ""}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
