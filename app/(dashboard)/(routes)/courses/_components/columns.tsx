"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu } from "@/components/ui/dropdown-menu"
import { Course } from "@/lib/models"
import { cn } from "@/lib/utils"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react"
import Link from "next/link"

// export type Course = {
//     course_id: string;
//     title: string
//     price: number
//     is_published: "true" | "false" | "success" | "failed"
//     action: string
// }


export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: "Title",
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price") || "0");
            const formatted = new Intl.NumberFormat("en-us", {
                style: "currency",
                currency: "USD"
            }).format(price);

            return (
                <div>{price}</div>
            )
        }
    },
    {
        accessorKey: "level",
        header: "Level",
    },
    {
        accessorKey: "is_published",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const isPublished = row.getValue("is_published")

            return (
                <Badge className={cn("bg-slate-500", isPublished && "bg-isky_orange")}>
                    {isPublished ? "Published" : "Draft"}
                </Badge>
            )
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { course_id } = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-4 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/courses/${course_id}/`}>
                            <DropdownMenuItem className="px-3 py-1 rounded-lg shadow-md flex justify-between items-center gap-x-1 bg-white">
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]
