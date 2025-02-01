import React, { useEffect, useState } from 'react';
import { Button, Input, Select } from 'antd';
import useFetch from '@/hooks/useFetch';
import { request } from '@/request';

const FilterComponent = ({ onFilterChange, onResetFilters, onSearch }) => {
    const { data: infoList, isLoading: infoLoading } = useFetch(() =>
        request.list({ entity: 'info' })
    );
    const [uniqueModes, setUniqueModes] = useState([]);
    const [uniqueUniversities, setUniqueUniversities] = useState([]);
    const [uniqueCourses, setUniqueCourses] = useState([]);
    const [uniqueElectives, setUniqueElectives] = useState([]);

    const [selectedMode, setSelectedMode] = useState(null);
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedElective, setSelectedElective] = useState(null);

    useEffect(() => {
        if (infoList && infoList.result) {
            const modes = [...new Set(infoList.result.map(item => item.mode_info))];
            const universities = [...new Set(infoList.result.map(item => item.university))];
            const courses = [...new Set(infoList.result.map(item => item.course))];
            const electives = [...new Set(infoList.result.map(item => item.electives))];

            setUniqueModes(modes);
            setUniqueUniversities(universities);
            setUniqueCourses(courses);
            setUniqueElectives(electives);
        }
    }, [infoList]);

    const handleResetFilters = () => {
        setSelectedMode(null);
        setSelectedUniversity(null);
        setSelectedCourse(null);
        setSelectedElective(null);
        onResetFilters();
    };

    return (
        <div className='flex items-center justify-between gap-2 mb-4'>
            <div className='space-x-2'>
                <Select
                    className='w-48'
                    placeholder="Select mode"
                    value={selectedMode}
                    onChange={(value) => {
                        setSelectedMode(value);
                        onFilterChange('mode_info', value);
                    }}
                    loading={infoLoading}
                >
                    {uniqueModes.map(mode => (
                        <Select.Option key={mode} value={mode}>{mode}</Select.Option>
                    ))}
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select university"
                    value={selectedUniversity}
                    onChange={(value) => {
                        setSelectedUniversity(value);
                        onFilterChange('university', value);
                    }}
                    loading={infoLoading}
                >
                    {uniqueUniversities.map(university => (
                        <Select.Option key={university} value={university}>{university}</Select.Option>
                    ))}
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select course"
                    value={selectedCourse}
                    onChange={(value) => {
                        setSelectedCourse(value);
                        onFilterChange('course', value);
                    }}
                    loading={infoLoading}
                >
                    {uniqueCourses.map(course => (
                        <Select.Option key={course} value={course}>{course}</Select.Option>
                    ))}
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select electives"
                    value={selectedElective}
                    onChange={(value) => {
                        setSelectedElective(value);
                        onFilterChange('electives', value);
                    }}
                    loading={infoLoading}
                >
                    {uniqueElectives.map(elective => (
                        <Select.Option key={elective} value={elective}>{elective}</Select.Option>
                    ))}
                </Select>
            </div>
            <div className='flex items-center gap-1'>
                <Input placeholder='search' onChange={(e) => onSearch(e.target.value)} />
                <Button onClick={handleResetFilters} className='text-red-600 font-thin bg-red-200 border-none hover:text-red-700'>Reset</Button>
            </div>
        </div>
    );
};

export default FilterComponent;
