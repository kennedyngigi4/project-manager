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
import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';



interface ChapterDescriptionFormProps {
    initialData: {
        description: string
    };
    courseId: string;
    chapterId: string;
}


const formSchema = z.object({
    description: z.string().min(1),
});

const ChapterDescriptionForm = ({
    initialData, chapterId
}: ChapterDescriptionFormProps) => {
    
    const { data: session } = useSession();
    const [isEditing, setEditing] = useState(false);

    const toggleEdit = () => setEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData?.description || "",
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/chapters/${chapterId}/`, values, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
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
                Chapter description
                <Button onClick={toggleEdit} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
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
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="Chapter description comes here ..."
                                            className="bg-white"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button disabled={!isValid || isSubmitting} type="submit">
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    )
}

export default ChapterDescriptionForm
