# QUANTARA SUPABASE SMTP CONFIGURATION
# Professional email setup with SendGrid integration

## 🔧 SUPABASE SMTP CONFIGURATION

### Step 1: Go to Supabase Dashboard
1. Open: https://supabase.com/dashboard
2. Select project: `quantara-backend`
3. Navigate to: **Authentication** → **Settings**

### Step 2: Enable Custom SMTP
1. Scroll down to **"SMTP Settings"**
2. Toggle **"Enable custom SMTP"** to **ON**
3. Fill in these EXACT values:

```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP User: apikey
SMTP Pass: [Your SendGrid API Key - provided separately]
Sender email: noreply@quantara-l.vercel.app
Sender name: Quantara
```

### Step 3: Save Configuration
1. Click **"Save"** at the bottom
2. Wait for **"Settings saved successfully"** message

## 📧 EMAIL TEMPLATE CONFIGURATION

### Update Confirmation Email Template
1. In Supabase: **Authentication** → **Email Templates**
2. Click **"Confirm signup"**
3. Replace with the professional template from: `/email-templates/confirmation.html`
4. Click **"Save"**

## 🛡️ CRITICAL SECURITY IMPLEMENTATION

### Implement RLS Policies (CRITICAL)
1. Go to: **Supabase Dashboard** → **SQL Editor**
2. Copy the entire SQL from: https://github.com/LARCONIC/Quantara/blob/main/database/rls-policies.sql
3. Paste and execute the complete script
4. This implements enterprise-grade security

## ✅ VERIFICATION CHECKLIST

After configuration, verify:
- [ ] SMTP settings saved in Supabase
- [ ] Email template updated with Quantara branding
- [ ] RLS policies implemented
- [ ] Test email confirmation works
- [ ] Professional email delivery confirmed

## 🚀 EXPECTED RESULTS

### Before Setup:
- ❌ Emails from `noreply@mail.supabase.io`
- ❌ 50% delivery rate
- ❌ Generic templates
- ❌ Security vulnerabilities

### After Setup:
- ✅ Emails from `noreply@quantara-l.vercel.app`
- ✅ 95%+ delivery rate
- ✅ Professional branded templates
- ✅ Enterprise-grade security

---
**Configuration prepared by Quantara deployment system**