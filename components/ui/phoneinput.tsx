"use client";

import React from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css"; // Default styles
import { cn } from "@/lib/utils"; // ShadCN utility

interface PhoneInputProps {
    value: string;
    onChange: (value: string) => void;
    error?: string;
}

const CustomPhoneInput: React.FC<PhoneInputProps> = ({ value, onChange, error }) => {
    return (
        <div className="w-full">
            <PhoneInput
                value={value}
                onChange={onChange}
                defaultCountry="KE" // Default to Kenya (Change as needed)
                international // Enables country codes
                className={cn(
                    "w-full border rounded-md p-2",
                    error ? "border-red-500" : "border-gray-300"
                )}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export default CustomPhoneInput;
