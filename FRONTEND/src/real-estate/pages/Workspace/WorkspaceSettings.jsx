import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const S = {
  container: { maxWidth: 1200, margin: '0 auto', paddingBottom: 60, fontFamily: 'Inter, sans-serif' },
  card: { background: '#fff', border: '1px solid #e2e8f0', borderRadius: 20, padding: 24, marginBottom: 24, boxShadow: '0 10px 30px rgba(15,23,42,.03)' },
  title: { fontSize: 18, fontWeight: 900, color: '#0f172a', margin: '0 0 6px', letterSpacing: '-.02em' },
  subtitle: { fontSize: 13, color: '#64748b', margin: '0 0 20px' },
  formGroup: { marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 },
  label: { fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: '#475569', letterSpacing: '.05em' },
  input: { border: '1px solid #cbd5e1', borderRadius: 12, padding: '12px 14px', fontSize: 14, outline: 'none', background: '#f8fafc' },
  button: { background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 20px', fontWeight: 800, fontSize: 13, cursor: 'pointer', display: 'inline-flex', alignSelf: 'flex-start' },
  badge: { fontSize: 11, fontWeight: 900, padding: '5px 10px', borderRadius: 999, display: 'inline-block' },
};

const PLAN_CARDS = [
  { name: 'Starter', price: 'Free', leads: '10 Leads/mo', slots: '2 Active Slots', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' },
  { name: 'Boost', price: '₹999/mo', leads: '50 Leads/mo', slots: '5 Active Promo Slots', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  { name: 'Elite', price: '₹2,499/mo', leads: '150 Leads/mo', slots: '15 Premium Slots', bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  { name: 'Prime', price: '₹4,999/mo', leads: 'Unlimited Leads', slots: 'Unlimited Prime Slots', bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
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
  const [team, setTeam] = useState([
    { id: 1, name: 'Ananya Sharma', email: 'ananya@doltec.com', role: 'Agent', status: 'Active' },
    { id: 2, name: 'Vikram Singh', email: 'vikram@doltec.com', role: 'Agent', status: 'Active' },
  ]);

  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Agent');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert('Profile settings saved successfully!');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const nameFromEmail = inviteEmail.split('@')[0];
    const cleanName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
    setTeam([...team, { id: Date.now(), name: cleanName, email: inviteEmail, role: inviteRole, status: 'Pending Invite' }]);
    setInviteEmail('');
    alert(`Invitation sent successfully to ${inviteEmail}!`);
  };

  return (
    <div style={S.container}>
      
      {/* 2-Column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, minmax(0, 1fr))', gap: 24 }}>
        
        {/* Left Column: Account Details & Team management */}
        <div style={{ gridColumn: 'span 7' }} className="settings-left-col">
          
          {/* Account Profile Details Card */}
          <div style={S.card}>
            <h3 style={S.title}>Workspace Profile</h3>
            <p style={S.subtitle}>Configure details for your real estate agent or builder workspace identity.</p>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={S.formGroup}>
                <label style={S.label}>Full Name</label>
                <input style={S.input} value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Email Address</label>
                <input style={S.input} value={profile.email} readOnly />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Phone Number</label>
                <input style={S.input} value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} />
              </div>
              <div style={S.formGroup}>
                <label style={S.label}>Agency / Organization Name</label>
                <input style={S.input} value={profile.orgName} onChange={e => setProfile({...profile, orgName: e.target.value})} />
              </div>
              <button type="submit" style={S.button}>Save Profile Changes</button>
            </form>
          </div>

          {/* Team Members List Card */}
          <div style={S.card}>
            <h3 style={S.title}>Team Access Management</h3>
            <p style={S.subtitle}>Add agents or support managers to collaborate on leads and list properties under your agency.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {team.map(member => (
                <div key={member.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#f8fafc', borderRadius: 14, border: '1px solid #e2e8f0' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>{member.name}</div>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{member.email} · {member.role}</div>
                  </div>
                  <span style={{
                    ...S.badge,
                    background: member.status === 'Active' ? '#dcfce7' : '#fffbeb',
                    color: member.status === 'Active' ? '#15803d' : '#b45309'
                  }}>{member.status}</span>
                </div>
              ))}
            </div>

            {/* Invite Form */}
            <form onSubmit={handleInvite} style={{ background: '#f8fafc', padding: 16, borderRadius: 16, border: '1px dashed #cbd5e1' }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Invite New Team Member</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px', gap: 10, marginBottom: 12 }}>
                <input style={{ ...S.input, background: '#fff' }} placeholder="agent.name@doltec.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
                <select style={{ ...S.input, background: '#fff' }} value={inviteRole} onChange={e => setInviteRole(e.target.value)}>
                  <option value="Agent">Agent</option>
                  <option value="Manager">Manager</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <button type="submit" style={{ ...S.button, background: '#2563eb' }}>Send Invite</button>
            </form>
          </div>

        </div>

        {/* Right Column: Billing & Upgrade Plans */}
        <div style={{ gridColumn: 'span 5' }} className="settings-right-col">
          
          {/* Active plan card */}
          <div style={{ ...S.card, background: '#0f172a', color: '#fff', border: 'none' }}>
            <div style={{ fontSize: 11, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '.14em', color: '#94a3b8', marginBottom: 6 }}>Active Subscriptions</div>
            <h3 style={{ ...S.title, color: '#fff', fontSize: 24, margin: '0 0 16px' }}>
              {activePlan} Tier <span style={{ ...S.badge, background: '#2563eb', color: '#fff', fontSize: 10, marginLeft: 8 }}>Active</span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#cbd5e1' }}>Active Listing Slots</span>
                <strong style={{ color: '#fff' }}>
                  {activePlan === 'Starter' ? '0 / 2 used' : 'Unlimited'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#cbd5e1' }}>Remaining Leads Credit</span>
                <strong style={{ color: '#fff' }}>
                  {activePlan === 'Starter' ? '10 leads left' : 'Unlimited'}
                </strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                <span style={{ color: '#cbd5e1' }}>Promoted Slots</span>
                <strong style={{ color: '#fff' }}>
                  {activePlan === 'Starter' ? '0 active' : 'All Active'}
                </strong>
              </div>
            </div>
          </div>

          {/* Upgrade tiers options */}
          <div style={S.card}>
            <h3 style={S.title}>Upgrade Plan & Listing Tiers</h3>
            <p style={S.subtitle}>Choose one of our premium real-estate tiers to unlock unlimited leads and premium visibility slots.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {PLAN_CARDS.map(plan => (
                <div key={plan.name} style={{
                  border: `1px solid ${plan.border}`,
                  borderRadius: 16,
                  padding: 16,
                  background: plan.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  transition: 'transform 0.15s'
                }}
                  onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'none'}
                  onClick={() => {
                    setActivePlan(plan.name);
                    alert(`Plan updated successfully to ${plan.name}!`);
                  }}
                >
                  <div>
                    <strong style={{ fontSize: 15, color: '#0f172a' }}>{plan.name}</strong>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>{plan.slots} · {plan.leads}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 14, fontWeight: 900, color: plan.color }}>{plan.price}</div>
                    {activePlan === plan.name ? (
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#15803d', marginTop: 4, display: 'block' }}>Current</span>
                    ) : (
                      <span style={{ fontSize: 10, fontWeight: 800, color: '#2563eb', marginTop: 4, display: 'block' }}>Upgrade</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      <style>{`
        @media (max-width: 1024px) {
          .settings-left-col, .settings-right-col {
            grid-column: span 12 !important;
          }
        }
      `}</style>

    </div>
  );
}
