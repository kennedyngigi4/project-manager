"use client"

import axios from 'axios'
import { Button } from '@/components/ui/button'
import { FileVideo, Pencil } from 'lucide-react'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

interface ChapterVideoFormProps {
    initialData: any;
    courseId: string;
    chapterId: string;
}

const ChapterVideoForm = ({
    initialData, courseId, chapterId
}: ChapterVideoFormProps) => {

    const [isEditing, setIsEditing] = useState(false);
    const [ video, setVideo] = useState(null);
    const [ progress, setProgress ] = useState(0);
    const { data: session } = useSession();

    const toggleEdit = () => setIsEditing((current) => !current);


    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setVideo(selectedFile);
    }

    const handleVideoUpload = async (e) => {

        const formData = new FormData();
        formData.append("videoUrl", video);
        formData.append("course", courseId);

        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/chapters/${chapterId}/`, formData, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setProgress(percentage);
                }
            });
            toast.success("Chapter updated");
            toggleEdit();
            location.reload();
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Chapter video
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <FileVideo className="h-4 w-4 mr-2" />
                            Upload video
                        </>
                    )}

                </Button>
            </div>

            {!isEditing && (
                <p className={cn("text-sm mt-2", !initialData?.videoUrl && "text-slate-500 italic")}>
                    {initialData?.videoPath 
                        ? <>
                            <video controls className="w-full" autoPlay>
                                <source src={initialData?.videoPath} type="video/mp4" />
                            </video>
                        </> 
                        : <>"No video uploaded"</>
                    }
                </p>
            )}


            {isEditing && (
                <form onSubmit={handleVideoUpload}>
                    <div className="py-3 w-[70%]">
                        <Input id="picture" type="file" className="bg-white" onChange={handleFileChange} />
                    </div>
                    <Progress value={progress} />
                    
                    <div>
                        <Button variant="default">Upload</Button>
                    </div>
                </form>
            )}

        </div>
    )
}

export default ChapterVideoForm