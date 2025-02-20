"use client"

import { Award, GraduationCap, Layout, LibraryBig, MessagesSquare, NotebookTabs } from 'lucide-react'
import React from 'react'
import SidebarItem from './sidebar-item';


const managerRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/",
    },
    {
        icon: LibraryBig,
        label: "Courses",
        href: "/courses",
    },
    {
        icon: NotebookTabs,
        label: "Instructors",
        href: "/instructors",
    },
    {
        icon: GraduationCap,
        label: "Students",
        href: "/students",
    },
    {
        icon: Award,
        label: "Awards",
        href: "/awards",
    },
    {
        icon: MessagesSquare,
        label: "Reviews",
        href: "/reviews",
    }
]

const SidebarRoutes = () => {

    const routes = managerRoutes;
    
    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem 
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    )
}

export default SidebarRoutes