"use client"

import React, { useEffect, useState } from 'react'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import axios from 'axios'
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast'

const InstructorsPage = () => {
  const { data:session, status } = useSession();
  const [ instructors, setInstructors ] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APIURL}/account/manager/instructors/`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setInstructors(response.data);
    }).catch((error) => {
      toast.error("Something went wrong");
    })

  }, [])

  return (
    <section className="p-6">
      <DataTable columns={columns} data={instructors} />
    </section>
  )
}

export default InstructorsPage