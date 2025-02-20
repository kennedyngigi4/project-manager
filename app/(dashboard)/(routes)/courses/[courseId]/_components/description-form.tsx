"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast';
import { Course } from '@/lib/models';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
}


const formSchema = z.object({
    description: z.string({ required_error: "Course description is required" })
})

const DescriptionForm = ({ initialData, courseId }: DescriptionFormProps) => {
    const { data: session } = useSession();

    const [ isEditing, setIsEditing ] = useState(false);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description,
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, values, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toggleEditing();
            toast.success("Course updated")
            location.reload()
        } catch {
            toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } })
        }
    }

  return (
    <section className="mt-6 bg-slate-100 rounded-md border p-4">
        <div className="flex items-center font-medium justify-between">
            Course description

            <Button onClick={toggleEditing} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit description
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
              <p className={cn("text-sm mt-2", !initialData?.description && "text-slate-500 italic")}>
                {initialData?.description
                    ? <>{initialData?.description}</>
                    : <>No description</>
                }
              </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField 
                        control={form.control}
                        name="description"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea 
                                        disabled={isSubmitting}
                                        className="bg-white"
                                        placeholder="Course description comes here."
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

export default DescriptionForm