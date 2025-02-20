"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Info, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"

export type User = {
    uid: string;
    fullname: string;
    email: string;
    level: string;
    phone: string;
    action: string;
}


export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "fullname",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Full Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "age_range",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Age
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const ageRange = row.getValue("age_range")
            return (
                <Badge className={cn("bg-slate-500", ageRange && "bg-isky_orange")}>
                    {ageRange ? ageRange : "Pending"}
                </Badge>
            )
        }   
        
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "phone",
        header: "Phone",
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { uid } = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-4 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {/* <Link href={`/instructors/${uid}/`}> */}
                            <DropdownMenuItem className="px-3 py-1 rounded-lg shadow-md flex justify-between items-center gap-x-1 bg-white">
                                <Info className="h-4 w-4 mr-2" />
                                Details
                            </DropdownMenuItem>
                        {/* </Link> */}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
