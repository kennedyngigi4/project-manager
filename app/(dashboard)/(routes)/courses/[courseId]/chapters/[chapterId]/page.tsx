"use client"

import axios from 'axios';
import { ArrowLeft, Eye, LayoutDashboard, VideoIcon } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ChapterTitleForm from './_components/chapter-title-form';
import ChapterActions from './_components/chapter-actions';
import { Banner } from '@/components/banner';
import ChapterDescriptionForm from './_components/chapter-description-form';
import ChapterVideoForm from './_components/chapter-video-form';
import ChapterAccessForm from './_components/chapter-access-form';
import ChapterPositionForm from './_components/chapter-position-form';


const ChapterId = ({
    params
} : { params: { courseId: string, chapterId: string} }) => {
    const { data: session, status } = useSession();
    const resolvedParams = React.use(params);
    const router = useRouter();
    const [ chapter, setChapter ] = useState();

    useEffect(() => {
        axios.get(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/chapters/${resolvedParams.chapterId}/`, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        }).then((response) => {
            setChapter(response.data);
            console.log(response.data);
        })
    }, []);


    const requiredFields = [
        chapter?.title,
        chapter?.description,
        chapter?.videoUrl,
        chapter?.position,
    ]

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`;

    const isComplete = requiredFields.every(Boolean);


    return (
        <>
            {!chapter?.is_published && (
            <Banner 
                variant="warning"
                label="This chapter is not published. It will not be in the course"
            />
            )}


            
        
            <section className="p-6">
                <div className="flex items-center justify-between">
                    <div className="w-full">
                        <Link href={`/courses/${resolvedParams?.courseId}`}
                            className="flex items-center text-sm hover:opacity-75 transition mb-6"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to course setup
                        </Link>

                        <div className="flex items-center justify-between w-full">
                            <div className="flex flex-col gap-y-2">
                                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                                <span className="text-sm text-slate-700">Complete all fields {completionText}</span>
                            </div>
                            <ChapterActions
                                disabled={!isComplete}
                                courseId={resolvedParams.courseId}
                                chapterId={resolvedParams.chapterId}
                                isPublished={chapter?.is_published}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div className="space-y-4">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <LayoutDashboard className="h-4 w-4" />
                                <h2 className="text-md">Customize your chapters</h2>
                            </div>
                            <ChapterTitleForm
                                initialData={chapter}
                                courseId={resolvedParams?.courseId}
                                chapterId={resolvedParams?.chapterId}
                            />

                        
                        </div>
                        <div>
                            <ChapterPositionForm
                                initialData={chapter}
                                courseId={resolvedParams?.courseId}
                                chapterId={resolvedParams?.chapterId}
                            />
                        </div>
                        <div className="">
                            <div className="flex items-center gap-x-2">
                                <Eye className="h-4 w-4" />
                                <h2 className="text-md">Access Settings</h2>
                            </div>
                            <ChapterAccessForm
                                initialData={chapter}
                                courseId={resolvedParams?.courseId}
                                chapterId={resolvedParams?.chapterId}
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center gap-x-2">
                            <VideoIcon className="h-4 w-4" />
                            <h2 className="text-md">Add a video</h2>
                        </div>
                        <ChapterVideoForm
                            initialData={chapter}
                            courseId={resolvedParams?.courseId}
                            chapterId={resolvedParams?.chapterId}
                        />
                    </div>
                </div>

                <div className="w-full">
                    <ChapterDescriptionForm
                        initialData={chapter}
                        courseId={resolvedParams?.courseId}
                        chapterId={resolvedParams?.chapterId}
                    />
                </div>
                
            </section>
    </>
    )
}

export default ChapterId