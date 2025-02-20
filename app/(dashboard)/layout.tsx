"use client"

import React, { useEffect } from 'react';
import Sidebar from './_components/Sidebar';
import Navbar from './_components/navbar';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Footer from './_components/footer';

const DashboardLayout = ({
    children
} : Readonly<{ children: React.ReactNode }>) => {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status != "authenticated"){
      router.push("/auth/signin");
    }
  }, [status]);

  return (
    <section className="h-full">
      <div className="h-[50px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 pt-[50px] min-h-screen bg-slate-50">
        {children}
      </main>
      <div className="">
        <Footer />
      </div>
    </section>
  )
}

export default DashboardLayout