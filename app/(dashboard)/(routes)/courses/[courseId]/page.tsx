"use client"
import axios from 'axios';
import { error } from 'console';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import TitleForm from './_components/title-form';
import DescriptionForm from './_components/description-form';
import CategoryForm from './_components/category-form';
import LevelForm from './_components/level-form';
import { DollarSign, LayoutDashboard, ListChecks, User } from 'lucide-react';
import PriceForm from './_components/price-form';
import InstructorForm from './_components/instructor-form';
import ImageForm from './_components/image-form';
import ChaptersForm from './_components/chapters-form';
import { Banner } from '@/components/banner';
import Actions from './_components/actions';
import AttachmentsForm from './_components/attachments-form';

const CourseIdPage = ({
    params
} : { params: { courseId: string }}) => {
    const router = useRouter();
    const { data:session, status } = useSession();
    const resolvedParams = React.use(params);
    const [course, setCourse] = useState();
    const [ instructors, setInstructors ] = useState([]);

    // Load course data from the courseId parsed via params
    useEffect(() => {
      axios.get(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${resolvedParams.courseId}/`, {
        headers: {
          'Authorization': `Token ${session?.accessToken}`
        }
      }).then((response) => {
        console.log(response.data)
        setCourse(response.data);
      }).catch((error) => {
        toast.error("Something went wrong");
      })
    }, [resolvedParams?.courseId]);


    // Load all instructors
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
    }, []);


    useEffect(() => {
      if (status != "authenticated"){
        router.push("/signin");
      }
    }, [status]);


    const requiredFields = [
      course?.title,
      course?.description,
      course?.level,
      course?.category,
      course?.price,
      course?.instructor,
      course?.image,
      course?.chapters.some((chapter: { is_published: any; }) => chapter.is_published)
    ]


    const categories = [
      { id: "1", name: "Computer Science" },
      { id: "2", name: "IT" },
      { id: "3", name: "Data Analysis" },
      { id: "4", name: "Animations" },
      { id: "5", name: "Graphic Design" },
    ]


    const levels = [
      { id: "1", name: "Early Education", },
      { id: "2", name: "Middle School", },
      { id: "3", name: "High School", },
      { id: "4", name: "Pre-University", },
    ]

    const totalFields = requiredFields.length;
    const completedField = requiredFields.filter(Boolean).length;
    const completionText = `(${completedField}/${totalFields})`;
    const isComplete = requiredFields.every(Boolean);



    return (
      <>
        {!course?.is_published && (
          <Banner
            label="This course is unpublished. It will not be visible to students."
          />
        )}

        <section className="p-6 z-20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">
                Course setup
              </h1>
              <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
            </div>
            <Actions
              disabled={!isComplete}
              courseId={resolvedParams?.courseId}
              isPublished={course?.is_published}
            />
          </div>


          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-16">
              <div>
                <div className="flex items-center gap-x-2">
                  <LayoutDashboard className="h-4 w-4" />
                  <h2 className="text-xl">Customize your course</h2>
                </div>

                <TitleForm 
                  initialData={course}
                  courseId={course?.course_id}
                />


                <LevelForm
                  initialData={course}
                  courseId={course?.course_id}
                  options={levels.map((level) => ({
                    label: level.name,
                    value: level.name,
                  }))}
                />

                <CategoryForm 
                  initialData={course}
                  courseId={course?.course_id}
                  options={categories.map((category) => ({
                    label: category.name,
                    value: category.name,
                  }))}
                />


                <ImageForm
                  initialData={course}
                  courseId={course?.course_id}
                />

              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-x-2">
                    <ListChecks />
                    <h2 className="text-md">Course chapters</h2>
                  </div>
                  <div>
                    <ChaptersForm
                      initialData={course}
                      courseId={course?.course_id}
                      instructor={course?.instructor}
                    />
                  </div>
                </div>


                <div>
                  <div className="flex items-center gap-x-2">
                    <DollarSign className="h-4 w-4 mr-2" />
                    <h2 className="text-xl">Course price</h2>
                  </div>
                  <PriceForm
                    initialData={course}
                    courseId={course?.course_id}
                  />
                </div>

                <div>
                  <AttachmentsForm 
                    initialData={course}
                    courseId={course?.course_id}
                  />

                </div>
                
                

              </div>
          </div>


          <div className="mt-16">
            <DescriptionForm 
              initialData={course}
              courseId={course?.course_id}
            />
          </div>

          <div className="grid md:grid-cols-2 grid-cols-1 gap-6 mt-16">
            <div>
              <div className="flex items-center gap-x-2">
                <User className="h-4 w-4 mr-2" />
                <h2 className="text-xl">Course Instructor</h2>
              </div>
              <InstructorForm
                initialData={course}
                courseId={course?.course_id}
                options={instructors.map((instructor) => ({
                  label: instructor?.fullname,
                  value: instructor?.uid,
                }))}
              />
            </div>
          </div>

        </section>
      </>
    )
}

export default CourseIdPage