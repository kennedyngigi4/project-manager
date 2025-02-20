"use client";
import React, { useState } from 'react';
import z from "zod";
import axios from "axios";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
    Form, FormControl, FormField, FormItem, FormMessage
} from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import ChaptersList from './chapters-list';
import { useSession } from 'next-auth/react';



interface ChaptersFormProps {
    initialData: any;
    courseId: string;
    instructor: string;
}


const formSchema = z.object({
    title: z.string().min(1),
    course: z.string(),
    instructor: z.string(),
});

const ChaptersForm = ({
    initialData, courseId, instructor
}: ChaptersFormProps) => {
    const router = useRouter();
    const { data:session } = useSession();
    const [isCreating, setIsCreating] = useState(false);

    const toggleCreating = () => {
        setIsCreating((current) => !current);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            course: courseId || "",
            instructor: instructor || "",
        }
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const chapterData = {
            title: values.title,
            course: courseId,
            instructor: instructor,
        }

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/chapters/`, chapterData, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toast.success("Chapter created");
            toggleCreating();
            location.reload();
        } catch {
            toast.error("Something went wrong");
        }
    }


    const onEdit = (id: string) => {
        router.push(`/courses/${courseId}/chapters/${id}`);
    }

    return (
        <div className="mt-6 border bg-slate-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Course chapters
                <Button onClick={toggleCreating} variant="ghost">
                    {isCreating ? (
                        <>Cancel</>
                    ) : (
                        <>
                            {instructor && (
                                <>
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Add a chapter
                                </>
                            )}
                            
                        </>
                    )}

                </Button>
            </div>
            {isCreating && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button disabled={!isValid || isSubmitting} type="submit">
                            Create
                        </Button>

                    </form>
                </Form>
            )}
            {!isCreating && (
                <div className={cn("text-sm mt-2", !initialData?.chapters.length && "text-slate-500 italic")}>
                    {!initialData?.chapters.length && "No chapters"}
                    <ChaptersList
                        onEdit={onEdit}
                        items={initialData?.chapters || []}
                    />
                </div>
            )}
        </div>
    )
}

export default ChaptersForm
