// src/components/ResumeSections/ContactInfo.jsx
import React from 'react'
import { LuPhone } from 'react-icons/lu'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const ContactInfo = ({ icon, iconBG, value }) => {
    let displayValue = value;

    // if we passed a <LuPhone /> icon, format the number
    if (value && icon?.type === LuPhone) {
        const pn = parsePhoneNumberFromString(value)
        if (pn && pn.isValid()) {
            displayValue = pn.formatInternational(); 
        }
    }

    return (
        <div className="flex gap-3 items-center">
            <div
                className="w-[25px] h-[25px] flex items-center justify-center rounded-full"
                style={{ backgroundColor: iconBG }}
            >
                {icon}
            </div>
            <p className="flex-1 text-[12px] font-medium break-all">
                {displayValue}
            </p>
        </div>
    )
}

export default ContactInfo
