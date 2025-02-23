"use client"

import React, { useEffect } from 'react'
import { useSession, } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
      

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 py-5">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>0</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Courses
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>0</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instructors
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>0</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Enrolled Students
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>0</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Transactions
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

    </section>
  )
}

export default DashboardPage