/**
 * ENTERPRISE SECURITY CONFIGURATION
 * Professional-grade security settings for production deployment
 */

// Environment Variables Required for Production
export const REQUIRED_ENV_VARS = {
  // Supabase Configuration
  VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
  VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY,
  
  // Custom SMTP (Required for Professional Email)
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  
  // Security Keys
  JWT_SECRET: process.env.JWT_SECRET,
  
  // Production Domain
  PRODUCTION_DOMAIN: process.env.PRODUCTION_DOMAIN || 'quantara-l.vercel.app'
}

// Security Headers for Production
export const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co https://*.vercel.app;
  `.replace(/\s+/g, ' ').trim()
}

// Rate Limiting Configuration
export const RATE_LIMITS = {
  // Authentication endpoints
  AUTH_SIGNUP: { requests: 5, window: '15m' },
  AUTH_LOGIN: { requests: 10, window: '15m' },
  AUTH_PASSWORD_RESET: { requests: 3, window: '1h' },
  
  // API endpoints
  API_GENERAL: { requests: 100, window: '15m' },
  API_ADMIN: { requests: 50, window: '15m' },
  
  // Email sending
  EMAIL_SEND: { requests: 10, window: '1h' }
}

// Password Policy (Enterprise Grade)
export const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  preventCommonPasswords: true,
  preventUserInfoInPassword: true,
  maxAge: 90, // days
  preventReuse: 12 // last 12 passwords
}

// Session Configuration
export const SESSION_CONFIG = {
  maxAge: 24 * 60 * 60, // 24 hours
  refreshThreshold: 60 * 60, // 1 hour before expiry
  absoluteTimeout: 7 * 24 * 60 * 60, // 7 days max
  requireReauth: ['admin', 'sensitive-operations']
}

// Audit Logging Requirements
export const AUDIT_EVENTS = [
  'user_login',
  'user_logout',
  'admin_action',
  'role_change',
  'password_change',
  'email_change',
  'data_export',
  'sensitive_data_access',
  'failed_login_attempt',
  'account_lockout'
]

// Data Classification
export const DATA_CLASSIFICATION = {
  PUBLIC: ['public_content', 'marketing_materials'],
  INTERNAL: ['user_profiles', 'application_data'],
  CONFIDENTIAL: ['financial_data', 'personal_info'],
  RESTRICTED: ['admin_data', 'security_logs', 'api_keys']
}

// Backup and Recovery
export const BACKUP_CONFIG = {
  frequency: 'daily',
  retention: 30, // days
  encryption: true,
  offsite: true,
  testRestore: 'monthly'
}

// Monitoring and Alerting
export const MONITORING_CONFIG = {
  uptime: { threshold: 99.9 },
  responseTime: { threshold: 2000 }, // ms
  errorRate: { threshold: 1 }, // %
  securityEvents: { alertImmediate: true },
  resourceUsage: { cpu: 80, memory: 80, disk: 85 }
}

// Compliance Requirements
export const COMPLIANCE = {
  GDPR: {
    dataRetention: 365, // days
    rightToErasure: true,
    dataPortability: true,
    consentManagement: true
  },
  SOC2: {
    accessControls: true,
    auditLogging: true,
    dataEncryption: true,
    incidentResponse: true
  }
}

// Validate environment for production
export const validateProductionEnvironment = (): boolean => {
  const missing: string[] = []
  
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
    if (!value) missing.push(key)
  })
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
  
  return true
}

export default {
  REQUIRED_ENV_VARS,
  SECURITY_HEADERS,
  RATE_LIMITS,
  PASSWORD_POLICY,
  SESSION_CONFIG,
  AUDIT_EVENTS,
  DATA_CLASSIFICATION,
  BACKUP_CONFIG,
  MONITORING_CONFIG,
  COMPLIANCE,
  validateProductionEnvironment
}