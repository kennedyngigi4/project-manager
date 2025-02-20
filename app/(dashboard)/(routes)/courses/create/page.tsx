"use client"
import React from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const formSchema = z.object({
    title: z.string({ required_error: "Course title is required" })
        .min(2, { message: "Course title must be at least 2 characters" })
})

const CreateCoursePage = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const form = useForm<z.infer <typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const handleTitleSubmit = async(values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/`, values, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            })

            if (response?.data.status_code == 201) {
                toast.success("Course created successfully.");
                router.push(`/courses/${response?.data.course}`)
            } else {
                toast.error("Something went wrong");
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong", { style: { background: "red", color: "#ffffff" } });
        }
    }

  return (
      <section className="max-w-5xl mx-auto my-auto flex flex-col items-center justify-center h-full p-6">
          <div className="h-screen">
              <h1 className="text-2xl font-semibold">
                  Name your course
              </h1>
              <p className="text-sm text-slate-600">
                  What would you like to name your course? Do not worry, you can change this later.
              </p>


              <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleTitleSubmit)} className="space-y-8 mt-8">
                      <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                              <FormItem>
                                  <FormLabel>Course title</FormLabel>
                                  <FormControl>
                                      <Input
                                          type="text"
                                          disabled={isSubmitting}
                                          placeholder="e.g. 'Introduction to game development'"
                                          {...field}
                                      />
                                  </FormControl>
                                  <FormDescription>
                                      What will you teach in this course?
                                  </FormDescription>
                                  <FormMessage />
                              </FormItem>
                          )}
                      />
                      <div>
                          <Link href="/courses"><Button variant="ghost" type="button">Cancel</Button></Link>
                          <Button type="submit" disabled={!isValid || isSubmitting}>Continue</Button>
                      </div>
                  </form>
              </Form>

          </div>
    </section>
  )
}

export default CreateCoursePage