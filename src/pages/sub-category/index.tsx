import { useEffect, useState } from "react";
import { Space, Button, Modal, Form, Input, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import subCategoryService from "../../service/sub-category";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import GlobalTable from "../../components/global-table";

const SubCategory = () => {
    const { categoryId } = useParams();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [form] = Form.useForm();
    const [editingSubCategory, setEditingSubCategory] = useState(null);
    const [total, setTotal] = useState();
    const { search } = useLocation();
    const navigate = useNavigate();
    const [params, setParams] = useState({
        limit: 5,
        page: 1,
    });

    const getData = async () => {
        setLoading(true);
        try {
          const res = await subCategoryService.get(categoryId, params); 
          setData(res?.data?.data?.subcategories);
          setTotal(res?.data?.data?.count);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      

    const addOrUpdateSubCategory = async (values:any) => {
        try {
            if (editingSubCategory) {
                await subCategoryService.update(editingSubCategory.id, values);
            } else {
                await subCategoryService.create({
                    name: values.name,
                    parent_category_id: Number(categoryId)
                });
            }
            getData();
            setVisible(false);
            form.resetFields();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteSubCategory = async (id:number) => {
        try {
            await subCategoryService.delete(id);
            message.success('Sub-category successfully deleted!');
            getData();
        } catch (error) {
            console.log(error);
        }
    };

    const editSubCategory = (subCategory:any) => {
        setEditingSubCategory(subCategory);
        form.setFieldsValue(subCategory);
        setVisible(true);
    };

    useEffect(() => {
        getData();
    }, [params, categoryId]);

    useEffect(() => {
        const params = new URLSearchParams(search);
        let page = Number(params.get("page")) || 1;
        let limit = Number(params.get("limit")) || 5;
        setParams((prev) => ({
            ...prev,
            page: page,
            limit: limit,
        }));
    }, [search]);

    const handleTableChange = (pagination:any) => {
        const { current, pageSize } = pagination;
        setParams((prev) => ({
            ...prev,
            limit: pageSize,
            page: current,
        }));
        const searchParams = new URLSearchParams(search);
        searchParams.set("page", `${current}`);
        searchParams.set("limit", `${pageSize}`);
        navigate(`?${searchParams}`);
    };
    const handleInputChange = (event:any) => {
        setParams((prev) => ({
            ...prev,
            search: event.target.value
        }))
        const search_params = new URLSearchParams(search)
        search_params.set("search", event.target.value)
        navigate(`?${search_params}`)
    }

    const columns = [
        {
            title: 'Sub-category name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_:any, record:any) => (
                <Space>
                    <Button style={{ backgroundColor: "#BC8E5B", color: "white" }} onClick={() => editSubCategory(record)}><EditOutlined /></Button>
                    {/* <GlobalDelete id={record.id} handleDelete={deleteSubCategory} /> */}
                    <Button className="bg-red-500 text-white" id={record.id} onClick={()=> deleteSubCategory(record.id)}>Delete</Button>
                </Space>
            ),
        }
    ];

    return (
        <div>
            <div className="flex gap-2 items-center mb-2">
                <Button type="primary" onClick={() => { setVisible(true); seteditingCategory(null); }}>Add  Sub-category</Button>
                <Input value={params.search} onChange={handleInputChange} className="w-[300px]" placeholder="Search..." />
            </div>            <GlobalTable
                columns={columns}
                data={data}
                loading={loading}
                pagination={{
                    current: params.page,
                    pageSize: params.limit,
                    total: total,
                    showSizeChanger: true,
                    pageSizeOptions: ['5', '10', '20', '50']
                }}
                handleChange={handleTableChange}
            />
            <Modal
                title={editingSubCategory ? "Edit Sub-category" : "Add Sub-category"}
                visible={visible}
                onCancel={() => setVisible(false)}
                onOk={() => form.submit()}
            >
                <Form form={form} onFinish={addOrUpdateSubCategory}>
                    <Form.Item name="name" label="Sub-category Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default SubCategory;
