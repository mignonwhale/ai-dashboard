'use client'

import { useState, useEffect } from 'react'

export default function TestHome() {
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Test Home Page</h1>
        <p>This is a test page to check routing</p>
        <div className="mt-4">
          <a href="/auth" className="btn btn-primary mr-2">Go to Auth</a>
          <a href="/dashboard" className="btn btn-secondary">Go to Dashboard</a>
        </div>
      </div>
    </div>
  )
}