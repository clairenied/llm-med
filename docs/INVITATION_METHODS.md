# User Invitation Methods

Since the system doesn't have email integration, here are the current and potential invitation methods:

## 🎯 Current Method (Manual Link Sharing)

### How It Works:
1. **Admin creates invitation** in User Management portal
2. **System generates unique signup link** with invitation ID
3. **Admin copies link** using "Copy" button
4. **Admin shares link manually** via preferred communication method
5. **User clicks link** and completes signup with pre-filled invitation details

### Advantages:
- ✅ **No email service required** - Works immediately
- ✅ **Flexible sharing** - Use any communication method
- ✅ **Secure** - Unique tokens with expiration
- ✅ **Trackable** - See invitation status in admin panel

### Current Sharing Options:
- 📧 **Email** (manual copy/paste)
- 💬 **Slack/Teams** (paste link in message)
- 📱 **Text message** (SMS with link)
- 🗨️ **Any messaging app** (WhatsApp, Discord, etc.)

## 🚀 Potential Enhancements

### 1. QR Code Generation
Generate QR codes for easy mobile sharing:
```
[QR Code] → https://yoursite.com/auth/signup?invitation=abc123
```

### 2. Bulk Invitations
Create multiple invitations at once:
```
emails: user1@example.com, user2@example.com, user3@example.com
→ Generate 3 separate invitation links
```

### 3. Custom Messages
Pre-formatted invitation messages:
```
"You're invited to join our Manuscript Review System!
Click here to sign up: [LINK]
This invitation expires in 7 days."
```

### 4. Integration Buttons
Quick sharing buttons:
- **Copy to Clipboard** ✅ (Already implemented)
- **Open Email Client** (mailto: link)
- **Share to Slack** (if Slack integration exists)

## 📋 Best Practices

### For Admins:
1. **Create invitation** with correct role (Admin/Reviewer/Author)
2. **Copy the signup link** immediately
3. **Share via secure channel** (work email, company Slack)
4. **Include context** in your message explaining what the system is for
5. **Monitor invitation status** in the admin panel

### Security Considerations:
- ✅ **Invitations expire** in 7 days
- ✅ **One-time use** - Cannot be reused after signup
- ✅ **Role-specific** - User gets assigned role from invitation
- ✅ **Admin tracking** - See who has/hasn't signed up

## 🔧 Technical Implementation

### Current Signup Flow:
```
1. User visits: /auth/signup?invitation=<ID>
2. System validates invitation (exists, not expired, not used)
3. Form pre-fills with invitation email and role
4. User completes signup
5. Invitation marked as "used"
6. User gets assigned the invitation role
```

### Database Schema:
```sql
Invitation {
  id: string (unique)
  email: string
  role: ADMIN | REVIEWER | AUTHOR
  expiresAt: datetime (7 days from creation)
  usedAt: datetime (null until signup)
  createdAt: datetime
}
```

This system is actually **more flexible** than email-based invitations since admins can share links through whatever communication method works best for their organization!
