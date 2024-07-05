import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@src/components/ui/form";
import { Button } from '@src/components/ui/button';
import * as z from 'zod';
import '@src/styles/globals.css';

// Define Zod schema for form validation
const FormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
});

const EditUserPage = () => {
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [user, setUser] = useState({ name: "", email: "" });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`/api/auth/${id}`);
        const data = await response.json();
        setUser(data.user);
        form.reset(data.user); // Set form default values after fetching user data
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };

    if (id) {
      fetchUserData();
    }
  }, [id]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch(`/api/auth/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        console.log("User updated successfully");
        alert("User updated successfully");
        router.push("/profile"); // Redirect to the profile page or any other page
      } else {
        console.error("Update failed");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  if (!user) {
    return <p>Loading user...</p>;
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <input {...field} placeholder="Name" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
              <input {...field} placeholder="Email" className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button className="w-full mt-6" type="submit">Update</Button>
    </form>
  );
};

export default EditUserPage;