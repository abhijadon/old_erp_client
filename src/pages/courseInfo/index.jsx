import { Badge } from 'antd';
import useLanguage from '@/locale/useLanguage';
import CourseModule from '@/modules/CourseModules'
export default function Admin() {
    const translate = useLanguage();
    const entity = 'info';

    const dataTableColumns = [
        {
            title: 'Mode',
            dataIndex: 'mode_info',
            key: 'mode_info',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'University',
            dataIndex: 'university',
            key: 'university',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Course',
            dataIndex: 'course',
            key: 'course',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Electives',
            dataIndex: 'electives',
            key: 'electives',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Reg fees',
            dataIndex: 'reg_fee',
            key: 'reg_fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Course fees',
            dataIndex: 'fee',
            key: 'fee',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Examination fees',
            dataIndex: 'examinationFee',
            key: 'examination',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Discounted total fees',
            dataIndex: 'ebd',
            key: 'ebd',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Advantages',
            dataIndex: 'advantages',
            key: 'advantages',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Eligibility',
            dataIndex: 'eligibility',
            key: 'eligibility',
            render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span>,
        },
        {
            title: 'Website URL',
            dataIndex: 'website_url',
            key: 'website_url',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
        {
            title: 'Utm Link',
            dataIndex: 'utm_link',
            key: 'utm_link',
            render: (text) => (
                <a href={text} target="_blank" rel="noopener noreferrer">
                    {text}
                </a>
            ),
        },
    ];

    const Labels = {
        PANEL_TITLE: translate('course'),
        DATATABLE_TITLE: translate('course_list'),
        ADD_NEW_ENTITY: translate('add course'),
        ENTITY_NAME: translate('course'),
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
    };

    return (
        <CourseModule
            config={config}
        />
    );
}
