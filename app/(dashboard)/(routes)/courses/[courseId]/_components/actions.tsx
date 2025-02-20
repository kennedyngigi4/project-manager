"use client"

import { ConfirmModal } from '@/components/modals/confirm-modal';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';


interface ActionsProps {
    disabled: boolean;
    courseId: string;
    isPublished: boolean
}

const Actions = ({
    disabled, courseId, isPublished
}: ActionsProps) => {
    const router = useRouter();
    const { data:session } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const onClick = async () => {
        if (isPublished) {
            const data = {
                "is_published": false,
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, data, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            })
            toast.success("Course unpublished");
            location.reload();

        } else {
            const data = {
                "is_published": true,
            }
            await axios.patch(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, data, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            })
            toast.success("Course published");
            location.reload();
        }
    }

    const onDelete = async () => {
        try {
            setIsLoading(true);

            await axios.delete(`${process.env.NEXT_PUBLIC_APIURL}/courses/manager/courses/${courseId}/`, {
                headers: {
                    'Authorization': `Token ${session?.accessToken}`
                }
            });
            toast.success("Course deleted");
            router.push('/courses');
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center gap-x-2">
            <Button
                onClick={onClick}
                disabled={disabled || isLoading}
                variant="outline"
                size="sm"
            >
                {isPublished ? "Unpublish" : "Publish"}
            </Button>
            <ConfirmModal onConfirm={onDelete}>
                <Button size="sm" disabled={isLoading}>
                    <Trash className="h-4 w-4" />
                </Button>
            </ConfirmModal>
        </div>
    )
}

export default Actions