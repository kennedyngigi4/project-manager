"use client"
import React, { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { Form, FormField, FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';



const formSchema = z.object({
  email: z.string({ required_error: "Email is required" })
        .min(1, { message: "Email is required" })
        .email({ message: "Invalid email address" }),
  password: z.string({ required_error: "Password is required" })
        .min(1, { message: "Password must be at least 8 characters" })
        .max(32, { message: "Password must be at most 32 characters" })
})

const SigninPage = () => {
  // const { status } = useSession();
  const [passwordView, setPasswordView] = useState(false);
  const router = useRouter();
  const [ isAuthenticating, setIsAuthenticating ] = useState("Sign in");


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    }
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    try{
      setIsAuthenticating("Authenticating");
      const response = await signIn('credentials', { email: values.email, password: values.password, redirect: false });
      if (response.error) {
        setIsAuthenticating("Sign in");
        toast.error("Email or Password is incorrect", { style: { background: "red", color: "#ffffff" } })
      } else {
        toast.success("Sign in successful");
        router.push('/');
      }
    } catch {
      setIsAuthenticating("Sign in");
      toast.error("Something went wrong", { style: { background: "bg-red", color: "text-white"  }});
    }
    
  }

  return (
    <section className="grid md:grid-cols-12 grid-cols-12 w-full h-screen">
      <div className="md:col-span-6 col-span-12 bg-[url(/images/bg/1.jpeg)] bg-cover bg-center">

      </div>
      <div className="md:col-span-6 col-span-12 flex flex-col justify-center p-20 space-y-16">

        <div>
          <h1 className="font-bold text-isky_orange text-2xl">Sign In</h1>
          <p className="text-slate-500">Welcome Back to <span className="text-isky_orange font-semibold">ISKY TECH</span>, Empowering Innovators</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 w-[70%]"> 
              <FormField 
                control={form.control}
                name="email"
                render={({field}) => {
                  return <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email"
                        placeholder="e.g. johndoe@email.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                }}
              />

              <FormField 
                control={form.control}
                name="password"
                render={({field}) => {
                  return <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={passwordView ? "text" : "password"}
                          placeholder="*********"
                          {...field}
                        />
                        {passwordView ? (
                          <Eye
                            className="absolute right-3 top-2 z-50 cursor-pointer text-gray-400"
                            onClick={() => {
                              setPasswordView(!passwordView)
                            }}
                          />
                        ) : (
                          <EyeOff
                            className="absolute right-3 top-2 z-50 cursor-pointer text-gray-400"
                            onClick={() => {
                              setPasswordView(!passwordView)
                            }}
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                }}
              />

              <div className="pt-3">
                <Button type="submit" className="bg-isky_orange w-full rounded-3xl py-5" disabled={!isValid || isSubmitting}>{isAuthenticating}</Button>
              </div>
          </form>
        </Form>

        <Link href="/auth/signup">You do not have account? Sign up</Link>
      </div>
    </section>
  )
}

export default SigninPage