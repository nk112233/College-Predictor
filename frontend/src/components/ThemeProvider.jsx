import React from 'react'

export default function ThemeProvider({ children , theme = "dark" }) {
  return (
    <div className={theme}>
    <div className='bg-slate-100 text-gray-700 dark:text-gray-200 dark:bg-[#222831] min-h-screen'>
      {children}
    </div>
  </div>
  )
}
