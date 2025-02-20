"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useEffect, useState } from 'react'
import { DataTable } from '../../courses/_components/data-table';
import { columns } from '../../courses/_components/columns';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import toast from 'react-hot-toast';

const InstructorDetailsPage = ({
    params
} : { params : { instructorId: string} }) => {
    const resolvedParams = React.use(params);
    const { data: session } = useSession();
    const [courses, setCourses] = useState([]);
    const [ instructorData, setInstructorData ] = useState({});

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_APIURL}/account/manager/instructors/${resolvedParams?.instructorId}/`, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        }).then((response) => {
            setInstructorData(response.data);
            setCourses(response?.data?.courses);
        }).catch((error) => {
            console.log(error)
            toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
        })
    }, [session?.accessToken]);

    return (
        <section className="p-6">

            <section className="grid md:grid-cols-12 grid-cols-12 gap-9">
                <div className="col-span-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                {courses?.length || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1>Courses</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                {instructorData?.chapters?.length || 0}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1>Chapters</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-6 md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">
                                0
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <h1>Reviews</h1>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-12 md:col-span-6">
                    <Card>
                        <CardContent>
                            <div className="flex md:flex-row flex-col">
                                <div className="basis-1/3">
                                    <div className="w-[120px] h-[120px] rounded-full bg-slate-200 mt-3 border"></div>
                                </div>
                                <div className="basis-2/3 space-y-2 pt-3">
                                    <p className="font-semibold">Full Name: {instructorData?.fullname}</p>
                                    <p className="font-semibold">Phone: {instructorData?.phone}</p>
                                    <p className="font-semibold">Email: {instructorData?.email}</p>
                                    <p className="font-semibold">Verification: {instructorData?.is_verified ? "Verified" : "Not Verified"}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>


            <section className="my-10">
                <h1 className="font-semibold text-xl">Courses assigned</h1>

                <DataTable columns={columns} data={courses} />
            </section>

        </section>
    )
}

export default InstructorDetailsPage