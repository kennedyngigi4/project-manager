"use client"

import { Button } from "@/components/ui/button"
import { ColumnDef } from "@tanstack/react-table"
import axios from "axios"
import { ArrowUpDown, Trash2Icon } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import toast from "react-hot-toast"

export type User = {
    badge_id: string;
    name: string;
    image: string;
    imagePath: string;
}


export const columns: ColumnDef<User>[] = [

    

    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "imagePath",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Verification
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({row}) => {
            const imagePath = row.getValue("imagePath");

            return (
                <>
                    <Image src={imagePath} width={60} height={60} alt="Badge" />
                </>
            )
        }
        
    },
    
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const { badge_id } = row.original;
            const { data: session } = useSession();

            const onDelete = async () => {
                axios.delete(`${process.env.NEXT_PUBLIC_APIURL}/competitions/manager/badges/${badge_id}/`, {
                    headers: {
                        'Authorization': `Token ${session?.accessToken}`
                    }
                }).then(() => {
                    toast.success("Deleted successfully")
                    location.reload();
                }).catch(() => {
                    toast.error("Something went wrong")
                })
            }

            return (
                <Trash2Icon className="h-4 w-4 text-red-500" onClick={onDelete}  />
            )
        }
    }
]
