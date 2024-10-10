import { Table } from 'antd';


const App = (props) => {
    const { columns, data, pagination, handleChange } = props
    return (
        <Table
            columns={columns}
            dataSource={data}
            pagination={pagination}
            onChange={(pagination) => handleChange(pagination)}
        />

    )
};
export default App;