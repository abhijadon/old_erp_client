import { Col, Divider, Row, Typography } from 'antd';

const { Title, Text } = Typography;

export default function SetingsSection({ title, children }) {
  return (
    <Row gutter={[24, 24]} className='flex'>
      <Col span={24}>
        <Title level={4}>{title}</Title>
      </Col>
      <Col
        xl={{ span: 18, offset: 2 }}
        lg={{ span: 24 }}
        md={{ span: 24 }}
        sm={{ span: 24 }}
        xs={{ span: 24 }}
      >
      </Col>
      <Col>
        {children}</Col>
    </Row>
  );
}
