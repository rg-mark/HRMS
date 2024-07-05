'use client';

import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from '@src/components/ui/button';
import '@src/styles/globals.css';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const FormSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(8, 'Password must have at least 8 characters'),
});

const SigninForm = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const [apiResponse, setApiResponse] = useState("");
  const router = useRouter();

  useEffect(() => {
  
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/sign-in");
        } else {
          const response = await fetch("/api/auth/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (!response.ok) {
            router.push("/sign-in");
          } else {
            router.push("/Navbar");
          }
        }
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    checkAuthentication();
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("----- Form Submitted------\n", "\nUsername : ", data.username, "\nPassword : ", data.password);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      const { token } = result;
      localStorage.setItem("token", token);
      console.log("----Login API Response---\n", result);
      if (response.ok) {
        setApiResponse("Redirecting . . . .");
        console.log("Login Successful...");
        router.push("/Navbar");
      } else {
        setApiResponse(result.message);
      }
    } catch (error) {
      setApiResponse("Server error");
      console.error("An error occurred:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input
                  placeholder="Username"
                  {...field}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <input
                  type="password"
                  placeholder="Password"
                  {...field}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Log In</Button>
      </form>
    </Form>
  );
};

export default SigninForm;
