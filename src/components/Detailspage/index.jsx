import { Button } from 'antd';
import React from 'react';
import { GrCertificate } from "react-icons/gr";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
export default function Index({ record }) {
    const handleDownload = (url) => {
        const link = document.createElement('a');
        link.href = url;
        link.download = url.split('/').pop();  // This will use the filename from the URL
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='grid grid-cols-2 gap-10'>
            <div>
                <h3 className='border-b text-lg font-thin text-gray-800'>University Details</h3>
                <div className='mt-6'>
                    <ul className='text-justify'>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Mode</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.mode_info}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>University</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.university}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Advantages</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.advantages}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Website URL</span>
                            <span className='flex-1 text-[#1F77B4] text-left'>
                                <a href={record.website_url} target="_blank" rel="noopener noreferrer">
                                    {record.website_url}
                                </a>
                            </span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Utm Link</span>
                            <span className='flex-1 text-[#1F77B4] text-left'>
                                <a href={record.utm_link} target="_blank" rel="noopener noreferrer">
                                    {record.utm_link}
                                </a>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <h3 className='border-b text-lg font-thin text-gray-800'>Course Details</h3>
                <div className='mt-6'>
                    <ul className='text-justify'>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Course</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.course}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Electives</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.electives}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Eligibility</span>
                            <span className='flex-1 text-gray-500 text-left'>{record.eligibility}</span>
                        </li>
                        {record.sampleMarksheets && record.sampleMarksheets.length > 0 && (
                            <li className='flex flex-col gap-2 mt-3'>
                                {record.sampleMarksheets.map((sheet, index) => (
                                    <Button className='rounded-md border-[#FFE98F] bg-[#FFE98F] text-[#FF6600] hover:text-[#FF6600] flex items-center gap-0.5 w-44'
                                        key={index}
                                        onClick={() => handleDownload(sheet.downloadURL)}
                                    >
                                        <span className='text-base'><GrCertificate /></span> <span>Sample Marksheet</span>
                                    </Button>
                                ))}
                            </li>
                        )}
                        {record.sampleDegrees && record.sampleDegrees.length > 0 && (
                            <li className='flex flex-col gap-2 mt-3'>
                                {record.sampleDegrees.map((sheet, index) => (
                                    <Button className='rounded-md border-[#8fff95] bg-[#8fff95] text-green-800 hover:text-green-800 flex items-center gap-0.5 w-44'
                                        key={index}
                                        onClick={() => handleDownload(sheet.downloadURL)}
                                    >
                                        <span className='text-base'><HiOutlineClipboardDocumentList /></span> <span>Sample Degree</span>
                                    </Button>
                                ))}
                            </li>
                        )}
                    </ul>
                </div>
            </div>
            <div className='col-span-2'>
                <h3 className='border-b text-lg font-thin text-gray-800'>Fees Details</h3>
                <div className='mt-6'>
                    <ul className='text-justify'>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Registration Fee</span>
                            <span className='flex-1 text-red-500 text-left'>₹ {record.reg_fee}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Course Fee</span>
                            <span className='flex-1 text-red-500 text-left'>₹ {record.fee}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Examination Fee</span>
                            <span className='flex-1 text-red-500 text-left'>₹ {record.examinationFee}</span>
                        </li>
                        <li className='flex justify-between mb-1 border-b leading-6 overflow-hidden text-ellipsis whitespace-nowrap'>
                            <span className='flex-1 text-gray-700'>Discounted Total Fees</span>
                            <span className='flex-1 text-red-500 text-left'>₹ {record.ebd}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
