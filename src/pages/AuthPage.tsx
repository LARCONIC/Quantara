import React, { useState } from 'react'
import { LoginForm } from '../components/auth/LoginForm'
import { SignUpForm } from '../components/auth/SignUpForm'

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignUpForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default AuthPage