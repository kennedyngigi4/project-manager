"use client"

import React, { useState } from 'react';
import axios from "axios";
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface ImageFormProps {
    initialData: {
        image: object;
    };
    courseId: string;
}




const ImageForm = ({
    initialData, courseId
}: ImageFormProps) => {
    const { data: session } = useSession();
    const [isEditing, setEditing] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const { register, handleSubmit, formState } = useForm();

    const { isSubmitting, isValid } = formState;


    const onSubmit = async (data: any) => {

        try {

            const formData = new FormData()
            formData.append("image", data.image[0])
            const response = await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, formData, {
                headers: {
                    'Authorization': `Token ${session.accessToken}`
                }
            });
            
            if (response.status == 200) {
                toast.success("Image uploaded")
                toggleEdit();
                location.reload()
            } else {
                toast.error("Image upload failed")
                toggleEdit();
                location.reload()
            }
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong");
        }
    }


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course image
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2", !initialData?.image && "text-slate-500 italic")}>



                    {initialData?.image
                        ? (<>
                            <Image src={initialData?.imagePath} width={500} height={250} alt="Course" />
                        </>
                        )
                        : (<>No image</>)}
                </div>
            )}
            {isEditing && (

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <input type="file" id="image" {...register("image")} />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>

            )}
        </div>
    )
}

export default ImageForm