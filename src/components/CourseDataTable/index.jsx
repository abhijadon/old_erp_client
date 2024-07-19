import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Drawer, Divider } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { course } from '@/redux/course/actions';
import { selectListItems, selectFilterItems } from '@/redux/course/selector';
import { crud } from '@/redux/crud/actions';
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaRegEye } from 'react-icons/fa6';
import { TbEdit } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import CourseInform from '@/forms/courseInform';
import FilterComponent from "../FilterComponent";

export default function Index({ config }) {
  const { entity, dataTableColumns } = config;
  const dispatch = useDispatch();
  const filter = useSelector(selectFilterItems);
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;
  const searchQuery = useSelector(state => state.course.search); // Retrieve search query from Redux state
  const [visible, setVisible] = useState(false);

  const handleDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
  };

  const dispatcher = () => {
    const filterField = filter.filterField; // Array of filter fields
    const filterValue = filter.filterValue; // Array of filter values

    dispatch(course.list({
      entity,
      options: {
        page: pagination.current,
        items: pagination.pageSize,
        filterField: filterField,
        filterValue: filterValue,
        q: searchQuery, // Include search query in the request options
      },
    }));
  };

  useEffect(() => {
    dispatcher();
  }, [filter, pagination.current, pagination.pageSize, searchQuery]); // Add searchQuery as a dependency

  const handleFilterChange = (field, value) => {
    dispatch(course.setFilter({ filterField: field, filterValue: value }));
  };

  const handleSearch = (value) => {
    dispatch(course.setSearch(value)); // Dispatch setSearch action with search query
  };

  const resetFilters = () => {
    dispatch(course.resetFilter());
    dispatcher();
  };

  const handleShowStudentDetails = (record) => {
    setSelectedStudent(record);
    setShowStudentDetailsDrawer(true);
  };

  const handleDelete = (record) => {
    dispatch(crud.currentAction({ actionType: 'delete', data: record }));
    modalClasses.open();
  };

  const handleEdit = (record) => {
    dispatch(crud.currentItem({ data: record }));
    dispatch(crud.currentAction({ actionType: 'update', data: record }));
    editBox.open();
    panel.open();
    collapsedBox.open();
  };

  const actionColumn = {
    title: 'Action',
    key: 'action',
    fixed: 'right',
    render: (text, record) => (
      <span className='flex items-center gap-2'>
        <FaRegEye
          title='Show'
          className='text-green-500 hover:text-green-700 text-base cursor-pointer'
          onClick={() => handleShowStudentDetails(record)}
        />
        <TbEdit
          title='Edit'
          className='text-blue-500 hover:text-blue-800 text-base cursor-pointer'
          onClick={() => handleEdit(record)}
        />
        <RiDeleteBin6Line
          title='Delete'
          className='text-red-500 hover:text-red-800 text-base cursor-pointer'
          onClick={() => handleDelete(record)}
        />
      </span>
    ),
  };

  const columns = [...dataTableColumns, actionColumn];

  const ButtonFunction = () => {
    return (
      <Button onClick={handleDrawer} type="primary" size="small" className='flex items-center gap-0.5 py-3.5 mb-6'>
        <span><IoIosAddCircleOutline /></span> <span>Add Course</span>
      </Button>
    );
  };

  return (
    <>
      <Card>
        <div className='flex justify-between items-center'>
          <span className='text-red-500 font-thin text-start mb-2'>
            Total: {pagination.total}
          </span>
          {ButtonFunction()}
        </div>
        <Divider />
        <FilterComponent onFilterChange={handleFilterChange} onResetFilters={resetFilters} onSearch={handleSearch} />
        <Table
          rowKey={(item) => item._id}
          loading={listIsLoading}
          dataSource={dataSource}
          pagination={pagination}
          columns={columns}
        />
      </Card>
      <Drawer title={
        <span className='flex items-center justify-center gap-2'>
          <span className='text-base font-thin'>Add Course</span>
        </span>
      } placement='top' onClose={handleCloseDrawer} visible={visible}>
        <CourseInform onClose={handleCloseDrawer} onFormSubmit={dispatcher} />
      </Drawer>
    </>
  );
}
