"use client"
import React, { useState } from 'react'
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';
import { Course } from '@/lib/models';
import { useSession } from 'next-auth/react';
import { Pencil } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import { cn } from '@/lib/utils';

interface PriceFormProps {
    initialData: Course;
    courseId: string;
}


const formSchema = z.object({
    price: z.coerce.number(),
})

const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
    const { data: session } = useSession();

    const [ isEditing, setIsEditing ] = useState(false);

    const toggleEditing = () => setIsEditing((current) => !current);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            price: initialData?.price || undefined,
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
            Course price

            <Button onClick={toggleEditing} variant="ghost">
                {isEditing ? (
                    <>Cancel</>
                ): (
                    <>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit price
                    </>
                )}
            </Button>
        </div>
        {!isEditing && (
            <p className={cn("text-sm mt-2", !initialData?.price && "text-slate-500 italic")}>
                {initialData?.price
                    ? formatPrice(initialData?.price) 
                    : "No price"
                }
            </p>
        )}

        {isEditing && (
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                    <FormField 
                        control={form.control}
                        name="price"
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        step="0.01"
                                        placeholder="Set a price for the course"
                                        disabled={isSubmitting}
                                        className="bg-white"
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

export default PriceForm