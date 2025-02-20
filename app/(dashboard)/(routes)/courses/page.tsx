"use client"
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

const CoursesPage = () => {
  const { data: session } = useSession();
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
      console.log(error)
      toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
    })
  }, [session?.accessToken]);

  return (
    <section className="p-6 flex flex-col h-full">

      <DataTable columns={columns} data={courses} />
      
    </section>
  )
}

export default CoursesPage