"use client"

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'
import { useSession } from 'next-auth/react'



const StudentsPage = () => {
  const { data:session } = useSession();
  const [students, setStudents ] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APIURL}/account/manager/students/`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setStudents(response.data);
    })
  }, [session?.accessToken]);

  return (
    <section className="p-6">
        <h1 className="font-semibold text-xl">Enrolled Students</h1>

        <div>
          <DataTable columns={columns} data={students} />
        </div>
    </section>
  )
}

export default StudentsPage