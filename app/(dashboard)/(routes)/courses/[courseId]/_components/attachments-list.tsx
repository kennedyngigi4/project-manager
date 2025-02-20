"use client"

import { Grip, Trash2 } from 'lucide-react'
import React from 'react'

interface AttachmentListProps {
    items: [];
    onDelete: (id: string) => void;
}

const AttachmentList = ({
    items, onDelete
}: AttachmentListProps ) => {
  return (
    <div>
        {items.map((attachment) => (
            <div key={attachment?.attachment_id} className="rounded-lg bg-slate-200 flex flex-row mb-1 justify-between py-1 px-3">
                <div className="flex flex-row">
                    <Grip className="h-5 w-5 pr-2" /> {attachment?.attached_file.split("/").at(-1)}
                </div>
                
                <div className="flex flex-row gap-x-5">
                    <Trash2 className="text-red-600 h-4 w-4 cursor-pointer hover:opacity-75 transition" onClick={() => onDelete(attachment?.attachment_id)}/>
                </div>
            </div>
        ))}
    </div>
  )
}

export default AttachmentList