import React from 'react'

const AuthLayout = ({
    children
} : Readonly<{ children: React.ReactNode }>) => {
  return (
    <section>
        {children}
    </section>
  )
}

export default AuthLayout