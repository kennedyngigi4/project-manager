"use client"
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const CoursesPage = () => {
  const { data: session, status } = useSession();
  const [ courses, setCourses ] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setCourses(response.data);
      console.log(response.data)
    }).catch((error) => {
      toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
    })
  }, []);

  return (
    <section className="p-6 flex flex-col h-full">

      <DataTable columns={columns} data={courses} />
      
    </section>
  )
}

export default CoursesPage