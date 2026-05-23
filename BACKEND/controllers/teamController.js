const TeamMember = require('../models/TeamMember');
const User = require('../models/User');
const Role = require('../models/Role');

exports.getTeamMembers = async (req, res) => {
  try {
    const orgId = req.user.orgId;
    if (!orgId) {
      return res.status(400).json({ success: false, message: 'User does not belong to an organization.' });
    }

    const members = await TeamMember.find({ orgId, deletedAt: null })
      .populate('userId', 'name email profile phone')
      .populate('roleId', 'name key')
      .sort({ createdAt: -1 });

    const formattedMembers = members.map(m => ({
      id: m._id,
      name: m.userId?.name || 'Unknown',
      email: m.userId?.email || 'N/A',
      role: m.roleId?.name || 'Agent',
      status: m.inviteStatus === 'active' ? 'Active' : (m.inviteStatus === 'invited' ? 'Pending Invite' : 'Revoked')
    }));

    res.status(200).json({ success: true, team: formattedMembers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.inviteTeamMember = async (req, res) => {
  try {
    const { email, role } = req.body;
    const orgId = req.user.orgId;

    if (!orgId) {
      return res.status(400).json({ success: false, message: 'User does not belong to an organization.' });
    }

    // Find or create role
    const roleKey = role ? role.toLowerCase() : 'agent';
    let targetRole = await Role.findOne({ orgId, key: roleKey });
    if (!targetRole) {
        targetRole = await Role.findOne({ scope: 'global', key: roleKey }); // fallback
        if (!targetRole) {
             targetRole = await Role.create({
                orgId,
                key: roleKey,
                name: role || 'Agent',
                scope: 'organization'
             });
        }
    }

    // Find or create user placeholder
    let targetUser = await User.findOne({ email });
    if (!targetUser) {
      targetUser = await User.create({
        email,
        name: email.split('@')[0],
        orgId,
        role: 'AGENT' // Default user system role
      });
    }

    // Check if already invited
    let existingMember = await TeamMember.findOne({ orgId, userId: targetUser._id });
    if (existingMember) {
       return res.status(400).json({ success: false, message: 'User is already part of this team.' });
    }

    const newMember = await TeamMember.create({
      orgId,
      userId: targetUser._id,
      roleId: targetRole._id,
      inviteStatus: 'invited',
      invitedByUserId: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Invitation sent successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTeamMemberStatus = async (req, res) => {
    try {
      const { status } = req.body;
      const orgId = req.user.orgId;
      const memberId = req.params.id;
  
      const member = await TeamMember.findOne({ _id: memberId, orgId });
      if (!member) {
         return res.status(404).json({ success: false, message: 'Team member not found.' });
      }
  
      if (status === 'Revoked') {
          member.inviteStatus = 'revoked';
          member.revokedAt = new Date();
          member.revokedBy = req.user._id;
      } else if (status === 'Active') {
          member.inviteStatus = 'active';
      }
      
      await member.save();
      res.status(200).json({ success: true, message: 'Status updated successfully.' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
