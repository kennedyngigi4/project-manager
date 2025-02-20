"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import toast from 'react-hot-toast';
import { Course } from '@/lib/models';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Pencil } from 'lucide-react';

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string, value: string; }[];
}


const formSchema = z.object({
    category: z.string({ required_error: "Course category is required" })
})

const CategoryForm = ({ initialData, courseId, options }: CategoryFormProps) => {
    const router = useRouter()
    const { data: session, status } = useSession();

    const [ isEditing, setIsEditing ] = useState(false);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: initialData?.category || "",
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try{
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, values, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toggleEditing();
            toast.success("Course updated")
            location.reload()
        } catch {
            toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" }})
        }
    }

  return (
    <section className="mt-6 bg-slate-100 rounded-md border p-4">
        <div className="flex items-center font-medium justify-between">
            Course category

            <Button onClick={toggleEditing} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit category
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className="text-sm mt-2">{initialData?.category}</p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField 
                        control={form.control}
                        name="category"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Combobox
                                        options={...options}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex items-center gap-x-2">
                        <Button disabled={!isValid || isSubmitting} type="submit">Save</Button>
                    </div>
                </form>
            </Form>
        )}

    </section>
  )
}

export default CategoryForm