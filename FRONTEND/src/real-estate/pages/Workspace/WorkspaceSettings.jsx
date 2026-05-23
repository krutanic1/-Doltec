import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchTeamMembers, inviteTeamMember as apiInviteTeamMember, updateTeamMemberStatus } from '../../services/teamApi';

const PLAN_CARDS = [
  { name: 'Starter', price: 'Free',      leads: '10 Leads/mo', slots: '2 Active Slots',        bg: 'rgba(241,245,249,0.5)', color: '#475569', border: 'rgba(226,230,240,0.8)' },
  { name: 'Boost',   price: '₹999/mo',   leads: '50 Leads/mo', slots: '5 Active Promo Slots',  bg: 'rgba(59,91,219,0.06)',  color: '#3b5bdb', border: 'rgba(59,91,219,0.18)' },
  { name: 'Elite',   price: '₹2,499/mo', leads: '150 Leads/mo',slots: '15 Premium Slots',      bg: 'rgba(250,162,25,0.06)', color: '#c47011', border: 'rgba(250,162,25,0.18)' },
  { name: 'Prime',   price: '₹4,999/mo', leads: 'Unlimited',   slots: 'Unlimited Prime Slots', bg: 'rgba(121,80,242,0.06)', color: '#7950f2', border: 'rgba(121,80,242,0.18)' },
];

export default function WorkspaceSettings() {
  const user = (() => { try { return JSON.parse(localStorage.getItem('user') || 'null'); } catch { return null; } })();
  
  const [profile, setProfile] = useState({
    name: user?.name || 'Tarun Sai K',
    email: user?.email || 'tarun@doltec.com',
    phone: user?.phone || '+91 98765 43210',
    orgName: 'Doltec Real Estate Agency',
  });

  const [activePlan, setActivePlan] = useState('Starter');
  const [team, setTeam] = useState([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setLoadingTeam(true);
    try {
      const res = await fetchTeamMembers();
      if (res.success) setTeam(res.team);
    } catch (err) {
      console.error('Failed to load team', err);
    } finally {
      setLoadingTeam(false);
    }
  };

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      await apiInviteTeamMember(inviteEmail, inviteRole);
      setInviteEmail('');
      alert(`Invitation sent successfully to ${inviteEmail}!`);
      loadTeam();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to send invite.');
    }
  };

  const handleRevoke = async (id) => {
    if (window.confirm('Are you sure you want to revoke access for this member?')) {
        try {
            await updateTeamMemberStatus(id, 'Revoked');
            loadTeam();
        } catch (err) {
            alert('Failed to revoke access.');
        }
    }
  };

  return (
    <div className="re-fade-in">
      
      {/* Header */}
      <div style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div className="re-eyebrow">Administration</div>
          <h1 className="re-page-title">Workspace Settings</h1>
          <p className="re-page-subtitle">Manage your profile, team access, and subscription billing details.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 24 }}>
        
        {/* Left Column: Account Details & Team management */}
        <div style={{ gridColumn: 'span 7' }} className="settings-left-col">
          
          {/* Account Profile Details Card */}
          <div className="re-card" style={{ marginBottom: 24 }}>
            <div className="re-card-body">
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Workspace Profile</h3>
              <p style={{ fontSize: 13, color: '#6b7494', margin: '0 0 20px', fontWeight: 500 }}>Configure details for your real estate agency or builder identity.</p>
              
              <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="re-label">Full Name</label>
                  <input className="re-input" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                </div>
                <div>
                  <label className="re-label">Email Address</label>
                  <input className="re-input" value={profile.email} readOnly style={{ background: '#f1f3f9', color: '#6b7494', cursor: 'not-allowed' }} />
                </div>
                <div>
                  <label className="re-label">Phone Number</label>
                  <input className="re-input" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div>
                  <label className="re-label">Agency / Organization Name</label>
                  <input className="re-input" value={profile.orgName} onChange={e => setProfile({...profile, orgName: e.target.value})} />
                </div>
                <button type="submit" className="re-btn re-btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}>Save Profile Changes</button>
              </form>
            </div>
          </div>

          {/* Team Members List Card */}
          <div className="re-card">
            <div className="re-card-body">
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Team Access Management</h3>
              <p style={{ fontSize: 13, color: '#6b7494', margin: '0 0 20px', fontWeight: 500 }}>Add agents or support managers to collaborate on leads and properties.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {team.map(member => (
                  <div key={member.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: '#f8f9fc', borderRadius: 14,
                    border: '1px solid rgba(226,230,240,0.8)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #3b5bdb, #2537a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0f1629' }}>{member.name}</div>
                        <div style={{ fontSize: 12, color: '#6b7494', marginTop: 2, fontWeight: 500 }}>{member.email} · <span style={{ color: '#0f1629', fontWeight: 700 }}>{member.role}</span></div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 100, fontSize: 11, fontWeight: 800,
                        background: member.status === 'Active' ? 'rgba(13,146,118,0.1)' : 'rgba(232,137,12,0.1)',
                        color: member.status === 'Active' ? '#0d9276' : '#e8890c',
                        border: member.status === 'Active' ? '1px solid rgba(13,146,118,0.2)' : '1px solid rgba(232,137,12,0.2)',
                      }}>{member.status}</span>
                      {member.status !== 'Revoked' && (
                        <button onClick={() => handleRevoke(member.id)} style={{
                            background: 'none', border: 'none', color: '#f03e5e', fontSize: 11, fontWeight: 800, cursor: 'pointer', textDecoration: 'underline'
                        }}>Revoke</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Invite Form */}
              <form onSubmit={handleInvite} style={{ background: 'rgba(59,91,219,0.03)', padding: 20, borderRadius: 16, border: '1px dashed rgba(59,91,219,0.3)' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#0f1629', marginBottom: 14 }}>Invite New Team Member</div>
                <div style={{ display: 'flex', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                  <input className="re-input" style={{ flex: '1 1 200px' }} placeholder="agent.name@doltec.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                  <select className="re-select" style={{ width: 140, flexShrink: 0 }} value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                    <option value="Agent">Agent</option>
                    <option value="Manager">Manager</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <button type="submit" className="re-btn re-btn-dark">Send Invite</button>
              </form>
            </div>
          </div>

        </div>

        {/* Right Column: Billing & Upgrade Plans */}
        <div style={{ gridColumn: 'span 5' }} className="settings-right-col">
          
          {/* Active plan card */}
          <div style={{
            background: 'linear-gradient(135deg, #0b0f1a 0%, #1a2550 100%)',
            color: '#fff', borderRadius: 20, padding: 28, marginBottom: 24,
            boxShadow: '0 16px 40px rgba(11,15,26,0.25)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -40, right: -40, width: 150, height: 150, borderRadius: '50%', background: 'rgba(59,91,219,0.15)' }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'rgba(186,200,255,0.7)', marginBottom: 8 }}>Active Subscription</div>
              <h3 style={{ fontSize: 26, fontWeight: 900, color: '#fff', margin: '0 0 20px', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 10 }}>
                {activePlan} Tier
                <span style={{ fontSize: 10, fontWeight: 800, background: '#0d9276', color: '#fff', padding: '3px 8px', borderRadius: 100, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Active Listing Slots</span>
                  <strong style={{ color: '#fff' }}>{activePlan === 'Starter' ? '0 / 2 used' : 'Unlimited'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Remaining Leads Credit</span>
                  <strong style={{ color: '#fff' }}>{activePlan === 'Starter' ? '10 leads left' : 'Unlimited'}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13.5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Promoted Slots</span>
                  <strong style={{ color: '#fff' }}>{activePlan === 'Starter' ? '0 active' : 'All Active'}</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade tiers options */}
          <div className="re-card">
            <div className="re-card-body">
              <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f1629', margin: '0 0 6px', letterSpacing: '-0.02em' }}>Upgrade Plan & Tiers</h3>
              <p style={{ fontSize: 13, color: '#6b7494', margin: '0 0 20px', fontWeight: 500 }}>Choose a premium tier to unlock unlimited leads and visibility.</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {PLAN_CARDS.map(plan => {
                  const isActive = activePlan === plan.name;
                  return (
                    <div key={plan.name} className="re-plan-card" style={{
                      background: isActive ? plan.bg : '#fff',
                      borderColor: isActive ? plan.color : 'rgba(226,230,240,0.8)',
                      boxShadow: isActive ? `0 0 0 3px ${plan.color}22` : 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                      onClick={() => {
                        setActivePlan(plan.name);
                        alert(`Plan updated successfully to ${plan.name}!`);
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: 15, fontWeight: 800, color: '#0f1629' }}>{plan.name}</strong>
                        <div style={{ fontSize: 12, color: '#6b7494', marginTop: 5, fontWeight: 500 }}>{plan.slots} · {plan.leads}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 14, fontWeight: 900, color: plan.color }}>{plan.price}</div>
                        {isActive ? (
                          <span style={{ fontSize: 10, fontWeight: 800, color: plan.color, marginTop: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Current</span>
                        ) : (
                          <span style={{ fontSize: 10, fontWeight: 800, color: '#3b5bdb', marginTop: 4, display: 'block', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Select</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .settings-left-col, .settings-right-col { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
}
