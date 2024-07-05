import { getServerSession } from 'next-auth'
import React from 'react'
import { useSession } from 'next-auth/react';


export default function page() {
    const { data: session, status } = useSession();
    if (status === 'loading') {
        return <p>Loading...</p>;
      }
    
      if (!session) {
        return <p>You are not authenticated. Please sign in.</p>;
      }
    
    return (
      <div>Welcome to the Admin Page</div>
    )
}