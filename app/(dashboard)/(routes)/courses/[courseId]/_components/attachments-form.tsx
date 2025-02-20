"use client"

import React, { useState } from 'react';
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod";
import { useForm } from 'react-hook-form';
import { Form, FormItem, FormControl, FormMessage, FormDescription, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Pencil, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import AttachmentList from './attachments-list';

interface AttachmentsFormProps {
    initialData: any;
    courseId: string;
}




const AttachmentsForm = ({
    initialData, courseId
}: AttachmentsFormProps) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isEditing, setEditing] = useState(false);
    const [ file, setFile ] = useState(null);

    const toggleEdit = () => setEditing((current) => !current);

    const { register, handleSubmit, formState } = useForm();

    const { isSubmitting, isValid } = formState;


    const handleFileChange = (e: any) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    }

    const onSubmit = async (e) => {
        try {

            const formData = new FormData();
            formData.append("course", courseId);
            formData.append("attached_file", file);
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/attachments/`, formData, {
                headers: {
                    'Authorization': `Token ${session.accessToken}`
                }
            });
            
            if (response.status == 200) {
                toast.success("File uploaded")
                toggleEdit();
                location.reload()
            } else {
                toast.error("File upload failed")
                toggleEdit();
                location.reload()
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    }


    const onDelete = async(id: string) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/attachments/${id}/`, {
            headers: {
                'Authorization': `Token ${session?.accessToken}`
            }
        }).then((response) => {
            toast.success("Deleted successfully");
            location.reload();
        }).catch(() => {
            toast.error("Something went wrong");
            location.reload();
        })

        
    }


    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course attachments
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add Attachment
                        </>
                    )}

                </Button>
            </div>
            {!isEditing && (
                <div className={cn("text-sm mt-2", !initialData?.image && "text-slate-500 italic")}>



                    {/* {initialData?.image
                        ? (<>
                            <Image src={initialData?.imagePath} width={500} height={250} alt="Course" />
                        </>
                        )
                        : (<>No image</>)} */}
                </div>
            )}
            {isEditing && (

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <input type="file" accept="application/pdf" onChange={handleFileChange} />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Save
                        </Button>
                    </div>
                </form>

            )}

            <div className={cn("text-sm mt-2", !initialData?.attachments.length && "text-slate-500 italic")}>
                {!initialData?.attachments.length && "No files available"}
                <AttachmentList 
                    onDelete={onDelete}
                    items={initialData?.attachments || []}
                />
            </div>
        </div>
    )
}

export default AttachmentsForm