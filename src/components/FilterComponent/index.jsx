import React from 'react';
import { Button, Input, Select } from 'antd';
import useFetch from '@/hooks/useFetch';

const FilterComponent = ({ onFilterChange, onResetFilters, onSearch }) => {

    const { data: courseList, isLoading: courseLoading } = useFetch(() =>
        request.list({ entity: 'course' })
    );
   
    return (
        <div className='flex items-center justify-between gap-2 mb-4'>
            <div className='space-x-2'>
                <Select
                    className='w-48'
                    placeholder="Select mode"
                    onChange={(value) => onFilterChange('mode_info', value)}
                >
                    <Select.Option value="ONLINE">ONLINE</Select.Option>
                    <Select.Option value="DISTANCE">DISTANCE</Select.Option>
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select university"
                    onChange={(value) => onFilterChange('university', value)}
                >
                    <Select.Option value="SPU">SPU</Select.Option>
                    <Select.Option value="SGVU">SGVU</Select.Option>
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select Course"
                    onChange={(value) => onFilterChange('course', value)}
                >
                    <Select.Option value="BA">BA</Select.Option>
                    <Select.Option value="BA">BA</Select.Option>
                </Select>
                <Select
                    className='w-48'
                    placeholder="Select Electives"
                    onChange={(value) => onFilterChange('electives', value)}
                >
                    <Select.Option value="General">General</Select.Option>
                    <Select.Option value="English">English</Select.Option>
                </Select>
            </div>
            <div className='flex items-center gap-1'>
                <Input placeholder='search' onChange={(e) => onSearch(e.target.value)} />
                <Button onClick={onResetFilters} className='text-red-600 font-thin bg-red-200 border-none hover:text-red-700'>Reset</Button>
            </div>
        </div>
    );
};

export default FilterComponent;
