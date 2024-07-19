import React, { useCallback, useEffect, useState } from 'react';
import { Card, Table, Button, Drawer, Divider, Modal } from 'antd';
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
import BrochureModal from "../BrochuresModal"
import { LiaFolderOpen } from "react-icons/lia";
import EditCourseInfo from '@/forms/EditCourseInfo';
import DetailsPage from "../Detailspage";
import { useCrudContext } from '@/context/crud';

export default function Index({ config }) {
  const { entity, dataTableColumns } = config;
  const dispatch = useDispatch();
  const filter = useSelector(selectFilterItems);
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, modal, editBox, advancedBox } = crudContextAction;
  const { result: listResult, isLoading: listIsLoading } = useSelector(selectListItems);
  const { pagination, items: dataSource } = listResult;
  const searchQuery = useSelector(state => state.course.search); // Retrieve search query from Redux state
  const [visible, setVisible] = useState(false);
  const [brochureVisible, setBrochureVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const handleDrawer = () => {
    setVisible(true);
  };

  const handleCloseDrawer = () => {
    setVisible(false);
  };

  const handleBrochureDrawer = () => {
    setBrochureVisible(true);
  };

  const handleCloseBrochureDrawer = () => {
    setBrochureVisible(false);
  };

  const handleCloseEditDrawer = () => {
    setEditVisible(false);
    setEditRecord(null);
  };

  const handleCloseDetailsDrawer = () => {
    setDetailsVisible(false);
    setSelectedRecord(null);
  };

  const handelDataTableLoad = useCallback((pagination) => {
    const filterField = filter.filterField; // Array of filter fields
    const filterValue = filter.filterValue;
    const options = {
      page: pagination.current || 1,
      items: pagination.pageSize || 10,
      filterField: filterField,
      filterValue: filterValue,
      q: searchQuery,
    };
    dispatch(course.list({ entity, options }));
  }, [dispatch, filter.filterField, filter.filterValue, searchQuery]);

  useEffect(() => {
    dispatcher();
  }, [filter, searchQuery]); // Add searchQuery and filter as dependencies

  const dispatcher = useCallback(() => {
    const filterField = filter.filterField; // Array of filter fields
    const filterValue = filter.filterValue;
    const options = {
      filterField: filterField,
      filterValue: filterValue,
      q: searchQuery,
    };
    dispatch(course.list({ entity, options }));
  }, [dispatch, filter.filterField, filter.filterValue, searchQuery]);

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
    setSelectedRecord(record);
    setDetailsVisible(true);
  };

  const handleDelete = (record) => {
    dispatch(course.delete({ id: record._id, entity }));
    modal.open();
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditVisible(true);
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
      <>
        <div className='flex gap-2'>
          <Button onClick={handleDrawer} size="small" className='flex items-center gap-0.5 py-3.5 mb-6 bg-blue-200 text-blue-500 hover:text-blue-700 hover:bg-blue-100'>
            <span><IoIosAddCircleOutline /></span><span>Add Course</span>
          </Button>
          <Button onClick={handleBrochureDrawer} size="small" className='flex items-center gap-0.5 py-3.5 mb-6 text-red-500 bg-red-200 capitalize hover:text-red-700 hover:bg-red-100 hover:border-red-500'>
            <span><LiaFolderOpen /></span>
            <span>Open Brochure</span>
          </Button>
        </div>
      </>
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
          pagination={false}
          onChange={handelDataTableLoad}
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
      <Drawer
        title={
          <div className='float-end font-thin text-base'>Brochures</div>
        }
        placement='right'
        onClose={handleCloseBrochureDrawer}
        visible={brochureVisible}
        width={900}
      >
        <BrochureModal onClose={handleCloseBrochureDrawer} />
      </Drawer>
      <Drawer
        title={
          <div className='flex items-center justify-center gap-2'>
            <span className='text-base font-thin'>Edit Course</span>
          </div>
        }
        placement='bottom'
        onClose={handleCloseEditDrawer}
        visible={editVisible}
        height={500}
      >
        {editRecord && <EditCourseInfo record={editRecord} onClose={handleCloseEditDrawer} onFormSubmit={dispatcher} />}
      </Drawer>
      <Drawer
        title={
          <div className='flex items-center justify-center gap-2'>
            <span className='text-base font-thin'>Course Details</span>
          </div>
        }
        placement='left'
        onClose={handleCloseDetailsDrawer}
        visible={detailsVisible}
        width={750}
      >
        {selectedRecord && <DetailsPage record={selectedRecord} onClose={handleCloseDetailsDrawer} />}
      </Drawer>
    </>
  );
}
