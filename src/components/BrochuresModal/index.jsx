import React, { useState, useEffect } from 'react';
import { Select, message, Spin, Button, Popconfirm } from 'antd';
import axios from 'axios';
import { MdOutlineFileDownload } from 'react-icons/md';
import { DeleteOutlined } from '@ant-design/icons';

// Initial state for filters
const initialFilters = {
    university: '',
    course: '',
    electives: '',
};

const Index = () => {
    const [filterOptions, setFilterOptions] = useState({ universities: [], courses: [], electives: [] });
    const [brochures, setBrochures] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState(initialFilters);

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

    const fetchBrochures = async (filters) => {
        setLoading(true);
        try {
            const response = await axios.get('/brochures/list', { params: filters });
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
        window.open(url, '_blank');
    };

    const handleDelete = async (fileUrl, university, course, electives) => {
        try {
            const response = await axios.post('/brochures/delete', { fileUrl, university, course, electives });
            if (response.data.success) {
                message.success(response.data.message);
                setBrochures(brochures.filter(brochure => brochure.downloadURL !== fileUrl));
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (error) {
            message.error(error.response?.data?.message || 'Delete failed');
        }
    };

    const handleReset = () => {
        setFilters(initialFilters);
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

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
                {loading ? (
                    <Spin size="large" />
                ) : brochures.length > 0 ? (
                    brochures.map((brochure, index) => (
                        <div key={index} className='text-center'>
                            <div className='text-center'>
                                <iframe
                                    src={brochure.downloadURL}
                                    width="250"
                                    height="180"
                                    title={`Brochure ${index}`}
                                    style={{ border: 'none' }}
                                />
                                <div className='mt-2 flex gap-4 items-center justify-center'>
                                    <Popconfirm
                                        title="Are you sure you want to download this PDF?"
                                        onConfirm={() => handleDownload(brochure.downloadURL)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button className="bg-transparent text-blue-600 border-none text-xl hover:text-blue-700" icon={<MdOutlineFileDownload />} />
                                    </Popconfirm>
                                    <Popconfirm
                                        title="Are you sure you want to delete this file?"
                                        onConfirm={() => handleDelete(brochure.downloadURL, brochure.university, brochure.course, brochure.electives)}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button className="bg-transparent text-red-600 border-none text-xl hover:text-red-700" icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                    <div className='flex flex-col'>
                                        <p className='font-semibold'>{brochure.university}</p>
                                        <p className='text-sm'>{brochure.course}</p>
                                        <p className='text-sm'>{brochure.electives}</p>
                                    </div>
                                </div>
                            </div>
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
