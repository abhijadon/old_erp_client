import React from 'react'
import PermissionAllowed from '../PermissionAllowed'
import Institute from '../Institute'
import { Card } from 'antd'
export default function index() {
    return (
        <div>
            <Card className='mr-3 mb-8'>
                <PermissionAllowed />
            </Card>
            <Card className='mb-8'>
                <Institute />
            </Card>
        </div>
    )
}
