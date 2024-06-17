import React from 'react'
import PermissionAllowed from '../PermissionAllowed'
import Institute from '../Institute'
import { Card, Col, Row } from 'antd'
import Brochure from '../Brochure'
export default function index() {
    return (
        <div>
            <div className='grid grid-cols-2 gap-4 mb-6'>
            <Card>
                <PermissionAllowed />
            </Card>
            <Card>
                <Brochure />
            </Card>
            </div>
            <Card className='mb-8'>
                <Institute />
            </Card>
        </div>
    )
}
