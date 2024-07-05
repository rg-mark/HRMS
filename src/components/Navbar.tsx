import Link from 'next/link'
import React from 'react'
import { buttonVariants } from '@src/components/ui/button'
import { Hospital } from 'lucide-react';
import '@src/styles/globals.css';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import '@src/styles/navigationmenu.css';
import { getServerSession } from 'next-auth';

const Navbar = async () => {

  return (
    <div className="bg-zinc-100p py-2 border-b border-s-zinc-200 fixed w-full z-10 top-0">
        <div className="container flex items-center justify-between">
            <Link href='/'>
            <Hospital /></Link>
            <NavigationMenu>
          <NavigationMenuList className="flex space-x-4">
            <NavigationMenuItem>
              <NavigationMenuTrigger>Menu</NavigationMenuTrigger>
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Referrals</NavigationMenuLink>
                <NavigationMenuLink href="/about">Appointments</NavigationMenuLink>
                <NavigationMenuLink href="/services">Patients</NavigationMenuLink>
                <NavigationMenuLink href="/contact">Analytics</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
          <NavigationMenuIndicator />
          <NavigationMenuViewport />
        </NavigationMenu>
            <Link className={buttonVariants()}href='/register'>Register</Link>
        </div>
    </div>
  )
}

export default Navbar