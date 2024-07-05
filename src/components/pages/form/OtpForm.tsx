'use client';
import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Button } from '@src/components/ui/button';
import '@src/styles/globals.css';
import { useRouter } from 'next/navigation';


const OTPSchema = z.object({
    otp: z.string().min(6, 'Otp is required').max(6, 'OTP must be 6 characters'),
  });


  const OtpForm = () => {
    const form = useForm<z.infer<typeof OTPSchema>>({
        resolver: zodResolver(OTPSchema),
        defaultValues: {
          otp:'',
        },
    })   
    const router = useRouter();

const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      const response = await fetch('/api/otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

if (response.ok) {
  
    const result = await response.json();
    console.log(result);
    router.push(`/sign-in`);
  } else {
    console.error('Failed to verify OTP');
  }
} catch (error) {
  console.error('An unexpected error occurred', error);
}

  };
  

return(
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className= "max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <div className='space-y-2'>
<FormField
control={form.control}
name="otp"
render={({ field }) => (
    <FormItem>
        <FormLabel>OTP</FormLabel>
        <FormControl>
            <input
                placeholder="OTP"
                {...field}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </FormControl>
        <FormMessage />
    </FormItem>
)}
/>
</div>
<Button className="w-full mt-4 bg-black hover:bg-gray-800 text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-black" type="submit">Verify OTP</Button>
</form>
</Form>
)

};

export default OtpForm