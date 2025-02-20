"use client"

import React, { useEffect } from 'react'
import { useSession, } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { data:session, status  } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != "authenticated") {
      router.push("/auth/signin")
    }
  }, [status]);

  return (
    <section className="p-6">
      <section>
        <h1 className="font-bold text-2xl">Welcome back, {session?.user?.name}</h1>
        <p className="text-slate-600">Todays quote that you posted is here ...</p>
      </section>
      
    </section>
  )
}

export default DashboardPage