import React, { useEffect, useState } from 'react';
import { Select, message, Spin, Image, Space, Button, Popconfirm } from 'antd';
import axios from 'axios';
import {
    DownloadOutlined, DeleteOutlined
} from '@ant-design/icons';
import { MdOutlineFileDownload } from 'react-icons/md';

const Index = () => {
    const [filterOptions, setFilterOptions] = useState({ universities: [], courses: [], electives: [] });
    const [brochures, setBrochures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        university: '',
        course: '',
        electives: '',
    });
    const onDownload = (url) => {
        // Create a temporary link element
        const link = document.createElement('a');
        link.href = url;
        link.download = true;

        // Trigger the click event on the link to start the download
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    };

    // Fetch filter options from the API
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await axios.get('/info/list');
                const result = response.data;
                if (result.success) {
                    const universities = [...new Set(result.result.map(item => item.university))];
                    const courses = [...new Set(result.result.map(item => item.course))];
                    const electives = [...new Set(result.result.map(item => item.electives))];
                    setFilterOptions({ universities, courses, electives });
                } else {
                    message.error('Failed to fetch filter options');
                }
            } catch (error) {
                console.error('Failed to fetch filter options', error);
                message.error('Failed to fetch filter options');
            }
        };

        fetchFilterOptions();
    }, []);

    // Fetch filtered brochures from the API
    const fetchBrochures = async (filters) => {
        setLoading(true);
        try {
            const response = await axios.get('/brochures/list', {
                params: filters,
            });
            const result = response.data;
            if (result) {
                setBrochures(result.brochures);
            } else {
                message.error('Failed to fetch brochures');
            }
        } catch (error) {
            console.error('Failed to fetch brochures', error);
            message.error('Failed to fetch brochures');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrochures(filters);
    }, [filters]);

    const handleSelectChange = (value, type) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [type]: value,
        }));
    };

    const handleDownload = (url) => {
        // Implement download logic here
        window.open(url, '_blank');
    };

    const handleReset = () => {
        setFilters({
            university: '',
            course: '',
            electives: '',
        });
    };

    return (
        <div>
            <div className='flex flex-wrap justify-between gap-4 mb-8'>
                <div className='space-x-4'>
                    <Select
                        className='w-56 h-8 rounded-full'
                        placeholder="Select a university"
                        onChange={(value) => handleSelectChange(value, 'university')}
                        allowClear
                    >
                        {filterOptions.universities.map((university, index) => (
                            <Select.Option key={index} value={university}>{university}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        className='w-56 h-8 rounded-full'
                        placeholder="Select a course"
                        onChange={(value) => handleSelectChange(value, 'course')}
                        allowClear
                    >
                        {filterOptions.courses.map((course, index) => (
                            <Select.Option key={index} value={course}>{course}</Select.Option>
                        ))}
                    </Select>
                    <Select
                        className='w-56 h-8 rounded-full'
                        placeholder="Select an elective"
                        onChange={(value) => handleSelectChange(value, 'electives')}
                        allowClear
                    >
                        {filterOptions.electives.map((elective, index) => (
                            <Select.Option key={index} value={elective}>{elective}</Select.Option>
                        ))}
                    </Select>
                </div>
                <div>
                    <Button onClick={handleReset} className='text-red-500 bg-red-300 border-red-500 font-thin text-sm relative hover:text-red-700'>Reset</Button>
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10' style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {loading ? (
                    <Spin size="large" />
                ) : brochures.length > 0 ? (
                    brochures.map((brochure, index) => (
                        <div key={index} className='text-center'>
                            <Image.PreviewGroup items={brochures.map(brochure => brochure.downloadURL)} preview={
                                <Space size={12} className="toolbar-wrapper">
                                    <DownloadOutlined onClick={() => handleDownload(brochure.downloadURL)} />
                                </Space>
                            }>
                                <div className='text-center'>
                                    <Image
                                        width={300}
                                        height={200}
                                        src={brochure.downloadURL}
                                        alt={`Brochure ${index}`}
                                    />
                                    <div className='mt-2 flex gap-4 items-center justify-center'>
                                        <Popconfirm
                                            title="Are you sure you want to download this image?"
                                            onConfirm={() => onDownload(brochure.downloadURL)}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Button className="bg-transparent text-blue-600 border-none text-xl hover:text-blue-700" icon={<MdOutlineFileDownload />} />
                                        </Popconfirm>
                                        <p className='font-semibold'>{brochure.university}</p>
                                        <p className='text-sm'>{brochure.course}</p>
                                        <p className='text-sm'>{brochure.electives}</p>
                                    </div>
                                </div>
                            </Image.PreviewGroup>
                        </div>
                    ))
                ) : (
                    <p>No brochures available</p>
                )}
            </div>
        </div>
    );
};

export default Index;
