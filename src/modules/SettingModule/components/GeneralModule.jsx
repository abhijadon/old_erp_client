import { PageHeader } from '@ant-design/pro-layout'
import { Col, Row } from 'antd';

export default function GeneralSetting({
  config,
  children,
}) {
  return (
    <>
      <PageHeader
        className='border-b-2 mb-4'
        ghost={false}
      ></PageHeader>
      <Row>
        <Col>
          {children}
        </Col>
      </Row>

    </>
  );
}
