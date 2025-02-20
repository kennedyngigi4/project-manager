"use client"
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Grip, Pencil } from 'lucide-react';
import React from 'react'

interface ChapterListProps {
    items: [];
    onEdit: (id: string) => void;
}

const ChaptersList = ({
    items, onEdit
}: ChapterListProps) => {




    return (
        <div>{items.map((chapter) => (
            <div className='py-1 px-3 rounded-lg bg-slate-200 mb-1 flex flex-row justify-between' key={chapter.chapter_id}>
                <div className="flex flex-row">
                    <Grip className="h-5 w-5 pr-2" /> {chapter.title}
                </div>

                <div className="flex flex-row gap-x-5">
                    <Badge className={cn("bg-slate-500", chapter.is_published && "bg-isky_orange")}>
                        {chapter.is_published ? "Published" : "Draft"}
                    </Badge>
                    <Pencil
                        onClick={() => onEdit(chapter.chapter_id)}
                        className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
                    />
                </div>
            </div>
        ))}</div>
    )
}

export default ChaptersList