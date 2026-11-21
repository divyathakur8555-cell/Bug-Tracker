
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Layers3,
  Menu,
  X,
  Bug,
  Users,
  BarChart3,
  ClipboardList,
  CheckCircle2,
  Code2,
  Zap,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { useState } from "react";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="tw-home">
      {/* NAVBAR */}
      <header className="tw-header">
        <div className="tw-nav-wrap">
          <Link to="/" className="tw-logo">
            <span className="tw-logo-icon"><Layers3 size={21} /></span>
            Trackwise
          </Link>

          <button
            className="tw-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>

          <nav className={menuOpen ? "tw-nav tw-nav-open" : "tw-nav"}>
            <a href="#features" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
            <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
            <Link to="/login" className="tw-login-link">Log in</Link>
            <Link to="/register" className="tw-nav-button">
              Get started <ArrowRight size={16} />
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="tw-hero">
        <div className="tw-hero-glow tw-glow-one" />
        <div className="tw-hero-glow tw-glow-two" />

        <div className="tw-hero-inner">
          <div className="tw-hero-copy">
            <div className="tw-eyebrow">
              <span className="tw-eyebrow-dot" />
              PROJECT MANAGEMENT, MADE CLEAR
            </div>

            <h1>
              Your projects.
              <br />
              Your team.
              <br />
              <span>One clear direction.</span>
            </h1>

            <p>
              Plan projects, track bugs, and keep your team moving forward.
              Trackwise brings your work together in one simple workspace.
            </p>

            <div className="tw-hero-actions">
              <Link to="/register" className="tw-primary-button">
                Start managing projects <ArrowRight size={18} />
              </Link>
              <a href="#features" className="tw-text-button">
                Explore features <ArrowUpRight size={17} />
              </a>
            </div>

            <div className="tw-trust-line">
              <div className="tw-avatar-stack">
                <span>JD</span>
                <span>AM</span>
                <span>RK</span>
                <span>+</span>
              </div>
              <div>
                <strong>Built for teams that build</strong>
                <small>Keep tasks, bugs, and people in sync.</small>
              </div>
            </div>
          </div>

          {/* DASHBOARD PREVIEW */}
          <div className="tw-preview-wrap">
            <div className="tw-preview-decoration" />

            <div className="tw-dashboard-preview">
              <div className="tw-preview-topbar">
                <div className="tw-preview-brand">
                  <span className="tw-preview-brand-icon">
                    <Layers3 size={13} />
                  </span>
                  Trackwise
                </div>
                <div className="tw-preview-top-actions">
                  <Bell size={15} />
                  <span className="tw-preview-user">JD</span>
                </div>
              </div>

              <div className="tw-preview-body">
                <aside className="tw-preview-sidebar">
                  <span className="tw-preview-side-active"><BarChart3 size={13} /> Overview</span>
                  <span><ClipboardList size={13} /> Projects</span>
                  <span><Bug size={13} /> Issues</span>
                  <span><Users size={13} /> Team</span>
                </aside>

                <div className="tw-preview-content">
                  <div className="tw-preview-heading">
                    <div>
                      <small>WORKSPACE / OVERVIEW</small>
                      <h3>Good morning, Jordan</h3>
                      <p>Here's what's happening with your projects.</p>
                    </div>
                    <span className="tw-preview-date">This week</span>
                  </div>

                  <div className="tw-preview-stats">
                    <div>
                      <small>Total projects</small>
                      <strong>12</strong>
                      <em>↗ 2 this month</em>
                    </div>
                    <div>
                      <small>Open issues</small>
                      <strong>24</strong>
                      <em className="tw-stat-warn">Needs attention</em>
                    </div>
                    <div>
                      <small>Completed</small>
                      <strong>86%</strong>
                      <em>↗ On track</em>
                    </div>
                  </div>

                  <div className="tw-preview-board-head">
                    <strong>Project progress</strong>
                    <span>View all →</span>
                  </div>

                  <div className="tw-preview-project">
                    <div className="tw-project-icon tw-project-purple"><Code2 size={15} /></div>
                    <div className="tw-project-info">
                      <strong>Website redesign</strong>
                      <small>8 of 10 tasks completed</small>
                      <div className="tw-progress"><i style={{ width: "80%" }} /></div>
                    </div>
                    <b>80%</b>
                  </div>

                  <div className="tw-preview-project">
                    <div className="tw-project-icon tw-project-green"><Zap size={15} /></div>
                    <div className="tw-project-info">
                      <strong>Mobile application</strong>
                      <small>5 of 12 tasks completed</small>
                      <div className="tw-progress"><i className="tw-progress-green" style={{ width: "42%" }} /></div>
                    </div>
                    <b>42%</b>
                  </div>

                  <div className="tw-preview-project">
                    <div className="tw-project-icon tw-project-orange"><ShieldCheck size={15} /></div>
                    <div className="tw-project-info">
                      <strong>Quality assurance</strong>
                      <small>9 of 10 tasks completed</small>
                      <div className="tw-progress"><i className="tw-progress-orange" style={{ width: "90%" }} /></div>
                    </div>
                    <b>90%</b>
                  </div>
                </div>
              </div>
            </div>

            <div className="tw-floating-card">
              <span className="tw-floating-check"><CheckCircle2 size={17} /></span>
              <div>
                <strong>Task completed!</strong>
                <small>Your team is making progress.</small>
              </div>
            </div>
          </div>
        </div>

        <div className="tw-hero-bottom">
          <span>PLAN BETTER</span>
          <span>TRACK PROGRESS</span>
          <span>DELIVER TOGETHER</span>
        </div>
      </section>

      {/* FEATURES */}
      <section className="tw-section" id="features">
        <div className="tw-section-heading">
          <span className="tw-section-label">EVERYTHING IN ONE PLACE</span>
          <h2>Less confusion. <span>More progress.</span></h2>
          <p>
            Everything your team needs to organize work, solve problems,
            and deliver great projects.
          </p>
        </div>

        <div className="tw-feature-grid">
          <article className="tw-feature-card">
            <div className="tw-feature-icon tw-feature-purple"><ClipboardList size={22} /></div>
            <h3>Project management</h3>
            <p>Organize projects, set priorities, and follow progress from one central workspace.</p>
            <a href="#how-it-works">Explore projects <ArrowRight size={15} /></a>
          </article>

          <article className="tw-feature-card">
            <div className="tw-feature-icon tw-feature-orange"><Bug size={22} /></div>
            <h3>Bug tracking</h3>
            <p>Report issues, assign owners, and track bugs until they are resolved.</p>
            <a href="#how-it-works">Track issues <ArrowRight size={15} /></a>
          </article>

          <article className="tw-feature-card">
            <div className="tw-feature-icon tw-feature-green"><Users size={22} /></div>
            <h3>Team collaboration</h3>
            <p>Keep everyone aligned with clear responsibilities and shared updates.</p>
            <a href="#how-it-works">Work together <ArrowRight size={15} /></a>
          </article>

          <article className="tw-feature-card">
            <div className="tw-feature-icon tw-feature-blue"><BarChart3 size={22} /></div>
            <h3>Reports and insights</h3>
            <p>Understand project progress and identify what needs attention.</p>
            <a href="#how-it-works">See progress <ArrowRight size={15} /></a>
          </article>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="tw-work-section" id="how-it-works">
        <div className="tw-work-inner">
          <div className="tw-work-copy">
            <span className="tw-section-label">A SIMPLER WORKFLOW</span>
            <h2>From first task to final delivery.</h2>
            <p>
              Give your team a clear process to follow. Keep every task
              visible and every project moving.
            </p>

            <div className="tw-work-step">
              <span>01</span>
              <div>
                <h3>Create your project</h3>
                <p>Set up a workspace and bring your project tasks together.</p>
              </div>
            </div>

            <div className="tw-work-step">
              <span>02</span>
              <div>
                <h3>Assign and track work</h3>
                <p>Give tasks owners, priorities, and clear due dates.</p>
              </div>
            </div>

            <div className="tw-work-step">
              <span>03</span>
              <div>
                <h3>Review and deliver</h3>
                <p>Monitor progress, resolve issues, and finish with confidence.</p>
              </div>
            </div>
          </div>

          <div className="tw-work-visual">
            <div className="tw-work-visual-top">
              <span>PROJECT WORKFLOW</span>
              <span className="tw-work-live"><i /> LIVE OVERVIEW</span>
            </div>

            <div className="tw-work-column">
              <div className="tw-work-column-title"><span className="tw-dot-gray" /> To do <b>2</b></div>
              <div className="tw-work-task">
                <small>DESIGN</small>
                <strong>Prepare wireframes</strong>
                <span>JD · High priority</span>
              </div>
              <div className="tw-work-task">
                <small>DEVELOPMENT</small>
                <strong>Set up project structure</strong>
                <span>AM · Medium priority</span>
              </div>
            </div>

            <div className="tw-work-column">
              <div className="tw-work-column-title"><span className="tw-dot-purple" /> In progress <b>1</b></div>
              <div className="tw-work-task">
                <small>BUG FIX</small>
                <strong>Resolve login issue</strong>
                <span>RK · High priority</span>
              </div>
            </div>

            <div className="tw-work-column">
              <div className="tw-work-column-title"><span className="tw-dot-green" /> Completed <b>2</b></div>
              <div className="tw-work-task tw-task-done">
                <small>PLANNING</small>
                <strong><CheckCircle2 size={13} /> Define project goals</strong>
                <span>JD · Completed</span>
              </div>
              <div className="tw-work-task tw-task-done">
                <small>DESIGN</small>
                <strong><CheckCircle2 size={13} /> Create brand guide</strong>
                <span>AM · Completed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="tw-about-section" id="about">
        <div className="tw-about-card">
          <span className="tw-section-label">READY TO GET ORGANIZED?</span>
          <h2>Make your next project your best one.</h2>
          <p>
            Bring your tasks, bugs, and team into one workspace.
            Start building a clearer way to work with Trackwise.
          </p>
          <Link to="/register" className="tw-primary-button">
            Get started for free <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="tw-footer">
        <Link to="/" className="tw-logo">
          <span className="tw-logo-icon"><Layers3 size={19} /></span>
          Trackwise
        </Link>
        <p>Plan clearly. Work together. Deliver better.</p>
        <div className="tw-footer-links">
          <a href="#features">Features</a>
          <Link to="/login">Log in</Link>
          <Link to="/register">Sign up</Link>
        </div>
        <small>© {new Date().getFullYear()} Trackwise. All rights reserved.</small>
      </footer>
    </div>
  );
}
