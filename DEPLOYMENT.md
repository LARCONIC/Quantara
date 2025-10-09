# 🚀 Quantara Deployment Guide

## 📋 Prerequisites

- ✅ **Supabase Account** with project created
- ✅ **Vercel Account** for deployment
- ✅ **GitHub Repository** with code
- ✅ **Domain** (optional, for custom domain)

## 🔧 Step-by-Step Deployment

### **1. Supabase Setup**

#### **Create Database Tables**
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Anyone can insert applications" ON client_applications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all applications" ON client_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can update applications" ON client_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

#### **Get Supabase Credentials**
1. Go to **Settings → API** in your Supabase dashboard
2. Copy your **Project URL**
3. Copy your **anon/public key**

### **2. Vercel Deployment**

#### **Environment Variables**
Set these in your Vercel project settings:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

#### **Build Configuration**
Ensure your `vercel.json` is configured:

```json
{
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### **3. Initial Admin Setup**

#### **After Deployment**
1. Visit: `https://your-domain.com/admin-setup`
2. Create your first admin account
3. Verify your email
4. Login at `/auth`
5. Access admin dashboard at `/admin`

## 🔒 Security Checklist

### **Before Going Live**
- ✅ **Environment variables** set in Vercel
- ✅ **RLS policies** enabled in Supabase
- ✅ **Email verification** configured
- ✅ **Strong admin password** created
- ✅ **Custom domain** configured (optional)
- ✅ **SSL certificate** active (automatic with Vercel)

### **Post-Deployment Security**
- ✅ **Test all user flows** (signup, login, applications)
- ✅ **Verify admin access** works correctly
- ✅ **Check application submission** and approval process
- ✅ **Test role-based access** on all protected routes
- ✅ **Monitor error logs** for any issues

## 🎯 Testing Your Deployment

### **1. Basic Functionality Test**
```bash
# Test these URLs work:
https://your-domain.com/                 # Homepage
https://your-domain.com/services         # Services page
https://your-domain.com/auth             # Authentication
https://your-domain.com/admin-setup      # Admin setup (first time only)
https://your-domain.com/admin            # Admin dashboard (after login)
```

### **2. User Flow Test**
1. **Submit partnership application** via `/services`
2. **Create admin account** via `/admin-setup`
3. **Login as admin** via `/auth`
4. **View application** in `/admin`
5. **Approve application** and verify user role changes

### **3. Security Test**
1. **Try accessing `/admin`** without login (should redirect)
2. **Try accessing `/admin`** with normal user (should show unauthorized)
3. **Test admin promotion** functionality
4. **Verify email verification** works

## 🚨 Common Issues & Solutions

### **Build Errors**
- **TypeScript errors**: Check for unused imports/variables
- **Missing dependencies**: Run `npm install`
- **Environment variables**: Ensure all VITE_ prefixed vars are set

### **Database Errors**
- **RLS policy errors**: Check if policies are properly configured
- **Connection errors**: Verify Supabase URL and key
- **Permission errors**: Ensure user has correct role

### **Authentication Issues**
- **Email verification**: Check spam folder
- **Login failures**: Verify password requirements
- **Role access**: Check user role in database

## 📊 Monitoring & Maintenance

### **Regular Checks**
- **Monitor application submissions** in admin dashboard
- **Review user registrations** and role assignments
- **Check error logs** in Vercel dashboard
- **Verify database performance** in Supabase

### **Security Audits**
- **Review admin accounts** quarterly
- **Check user permissions** regularly
- **Monitor failed login attempts**
- **Update dependencies** regularly

## 🎉 Success Metrics

Your deployment is successful when:
- ✅ **Homepage loads** without errors
- ✅ **Services page** accepts applications
- ✅ **Admin setup** creates first admin
- ✅ **Admin dashboard** shows applications
- ✅ **User management** works correctly
- ✅ **All protected routes** enforce permissions

## 🚀 **You're Live!**

**Congratulations!** Your Quantara ecosystem is now:
- **Production-ready** with enterprise security
- **Scalable** with proper architecture
- **Maintainable** with clean code organization
- **Documented** with comprehensive guides

**Start accepting real clients and building your business!** 💪