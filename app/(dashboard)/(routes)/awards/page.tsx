"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Form, FormField, FormControl, FormItem, FormLabel } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { DataTable } from './_components/data-table'
import { columns } from './_components/columns'

const formSchema = z.object({
  name: z.string().min(1),
})

const AwardsPage = () => {
  const { data:session } = useSession();
  const [ image, setImage ] = useState(null);
  const [ badges, setBadges ] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_APIURL}/competitions/manager/badges/`, {
      headers: {
        'Authorization': `Token ${session?.accessToken}`
      }
    }).then((response) => {
      setBadges(response.data);
      console.log(response.data)
    }).catch(() => {
      toast.error("Something went wrong", { style: { background: "#ff0000", color: "#ffffff" }});
    })
  }, [session?.accessToken]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    }
  })


  const handleonChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  }

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("image", image);

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_APIURL}/competitions/manager/badges/`, formData, {
        headers: {
          'Authorization': `Token ${session?.accessToken}`
        }
      }).then(() => {
        toast.success("Badge created")
        location.reload()
      }).catch(() => {
        toast.error("Something went wrong", { style: { background: "#ff0000", color: "#ffffff" } })
      })
    } catch {
      toast.error("Something went wrong", { style: { background: "#ff0000", color: "#ffffff" }  })
    }
  }

  return (
    <section className="p-6 grid md:grid-cols-12 grid-cols-12 gap-8">
      <div className="md:col-span-5 col-span-12">
        <Card>
          <CardHeader>
            <CardTitle>Add an Award</CardTitle>
          </CardHeader>
          <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <FormField 
                    control={form.control}
                    name="name"
                    render={({field}) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input 
                            type="text"
                            placeholder="Award name"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />


                  <Input
                    type="file"
                    placeholder="Award image"
                    onChange={handleonChange}

                  />

                  <div>
                    <Button type="submit">Upload</Button>
                  </div>
                </form>
              </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-7 col-span-12">
          <DataTable columns={columns} data={badges} />
      </div>
    </section>
  )
}

export default AwardsPage