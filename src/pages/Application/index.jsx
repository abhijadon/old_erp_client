// import { DownloadOutlined, LeftOutlined, RightOutlined, PrinterOutlined } from '@ant-design/icons';
import { Tag, Space, Tooltip } from 'antd';
import dayjs from 'dayjs'; // Import dayjs if not already imported
import CrudModule from '@/modules/CrudModule/CrudModule';
import LeadForm from '@/forms/LeadForm';
import useLanguage from '@/locale/useLanguage';
import '@/style/tailwind.css'
import EditForm from '../../forms/EdtiForm';
import AddForm from '../../forms/AddPayment';
import { useState } from 'react';
export default function Lead() {
  const translate = useLanguage();
  const [page, setPage] = useState(1);
  const entity = 'lead';
  const searchConfig = {
    displayLabels: ['full_name'],
    searchFields: ['full_name'],
    outputValue: '_id',
  };

  const toTitleCase = (str) => {
    if (!str) return ''; // Check for undefined or null
    return str.toLowerCase().replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
  };
  const entityDisplayLabels = ['number', 'company'];

  const dataTableColumns = [
    {
      title: 'S.No.',
      dataIndex: '',
      render: (value, item, index) => (page - 1) * 1000 + index + 1, // S.No. based on page and index
    },
    {
      title: translate('StudentID'),
      dataIndex: ['lead_id'],
    },
    {
      title: translate('Student Name'),
      dataIndex: ['full_name'],
      render: (text) => toTitleCase(text),
    },
    {
      title: 'Email',
      dataIndex: ['contact', 'email'],
      key: 'email',
      render: (email) => toTitleCase(email),
    },
    {
      title: 'Phone',
      dataIndex: ['contact', 'phone'],
      key: 'phone',
    },
    {
      title: translate('Course'),
      dataIndex: ['education', 'course'],
      key: 'course'
    },
    {
      title: translate('Specialization'),
      dataIndex: ['customfields', 'enter_specialization'],
      key: 'enter_specialization'
    },
    {
      title: translate('Session'),
      dataIndex: ['customfields', 'session'],
      key: 'session'
    },
    {
      title: translate('Admission type'),
      dataIndex: ['customfields', 'admission_type'],
      key: 'admission_type'
    },
    {
      title: translate('Institute Name'),
      dataIndex: ['customfields', 'institute_name'],
      key: 'institute_name'
    },

    {
      title: 'University Name', // Assuming 'university_name' is within customfields
      dataIndex: ['customfields', 'university_name'],
      key: 'university_name',
    },
    {
      title: 'User',
      dataIndex: ['userId', 'fullname'],
      key: 'userId', // Add a unique key for the column
      render: (userId) => toTitleCase(userId),
    },
    {
      title: translate('Father Name'),
      dataIndex: ['customfields', 'father_name'],
      key: 'father_name',
      render: (father_name) => toTitleCase(father_name),
    },
    {
      title: translate('Mother Name'),
      dataIndex: ['customfields', 'mother_name'],
      key: 'mother_name',
      render: (mother_name) => toTitleCase(mother_name),
    },
    {
      title: translate('Date of birth'),
      dataIndex: ['customfields', 'dob'],
      key: 'dob',
    },
    {
      title: translate('gender'),
      dataIndex: ['customfields', 'gender'],
      key: 'gender'
    },
    {
      title: translate('Total Course Fee'),
      dataIndex: ['customfields', 'total_course_fee'],
      key: 'total_course_fee'
    },
    {
      title: translate('Total Paid amount'),
      dataIndex: ['customfields', 'total_paid_amount'],
      key: 'total_paid_amount'
    },
    {
      title: translate('Due amount'),
      dataIndex: ['customfields', 'due_amount'],
      key: 'due_amount'
    },
    {
      title: translate('paymentStatus'),
      dataIndex: ['customfields', 'paymentStatus'],
      render: (paymentStatus) => {
        let color =
          paymentStatus === 'payment approved'
            ? 'green'
            : paymentStatus === 'payment received'
              ? 'cyan'
              : paymentStatus === 'payment rejected'
                ? 'red'
                : 'red';
        return <Tag color={color}>{paymentStatus && translate(paymentStatus)}</Tag>;
      },
    },
    {
      title: translate('Status'),
      dataIndex: ['customfields', 'status'],
      render: (status) => {
        let color =
          status === 'New'
            ? 'cyan'
            : status === 'Cancel'
              ? 'blue'
              : status === 'Alumini'
                ? 'green'
                : status === 'Not Intrested'
                  ? 'orange'
                  : 'red';
        return <Tag color={color}>{status && translate(status)}</Tag>;
      },
    },
    {
      title: 'Remark',
      dataIndex: ['customfields', 'remark'],
      key: 'remark',
      render: text => <Tooltip title={text}>
        <div className="truncate-text">{text}</div>
      </Tooltip>,
    },
    {
      title: translate('Created'),
      dataIndex: 'created',
      render: (date) => dayjs(date).format('DD/MM/YYYY'),
    },

  ];

  const Labels = {
    PANEL_TITLE: translate('applications'),
    DATATABLE_TITLE: translate('Applications'),
    ADD_NEW_ENTITY: translate('add_applications'),
    ENTITY_NAME: translate('applications'),
    CREATE_ENTITY: translate('save'),
    UPDATE_ENTITY: translate('update'),
  };
  const configPage = {
    entity,
    ...Labels,
  };
  const config = {
    ...configPage,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return (
    <>
      <CrudModule
        createForm={<LeadForm />}
        addForm={<AddForm isUpdateForm={true} />}
        updateForm={<EditForm isUpdateForm={true} />}
        config={config}
      />
    </>
  );
}
