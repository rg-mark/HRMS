
'use client';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { useRouter } from 'next/navigation';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from '@src/components/ui/button';
import '@src/styles/globals.css';


const FormSchema = z.object ({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().min(1, 'Email is required').email('Invalid email'),
    password: z.string().min(1, 'Password is required').min(8, 'Password must have more than 8 characters'),
    username: z.string(),
})   



const RegisterForm = () => {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          first_name:'',
          last_name:'',
          email:'',
          password:'',
          username: '',
        },  
    });  


    const onSubmit = async (data: z.infer<typeof FormSchema>) => {
        try {
          const response = await fetch('/api/registration', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            const router = useRouter();
            const result = await response.json();
            console.log(result);
            router.push(`/otp`);
          } else {
            console.error('Failed to register');
          }
        } catch (error) {
          console.error('An unexpected error occurred', error);
        }
      };


  return (
    
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className= "max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className='space-y-2'>
    <FormField
        control={form.control}
        name="first_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <input placeholder="First Name" {...field}  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
        />

<FormField
        control={form.control}
        name="last_name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <input placeholder="Last Name" {...field}  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
        />
<FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <input placeholder="Email" {...field}  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <input placeholder="Password" {...field}  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
        />
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <input placeholder="Username" {...field}  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormControl>
           
            <FormMessage />
          </FormItem>
        )}
      />
      </div>
      <Button className="w-full mt-6" type="submit">Submit</Button>
    </form>
    
  </Form>
  )
}
  
export default RegisterForm