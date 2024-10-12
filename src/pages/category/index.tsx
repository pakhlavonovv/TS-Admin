import { Button, Input, Modal, Space, message } from "antd";
import { useEffect, useState } from "react";
import { EditingCategory, CategoryValues } from "../../components/types";
import GlobalTable from "../../components/global-table";
import category from "../../service/categories";
import { Form } from "antd";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1,
  });

  const getData = async () => {
    try {
      const res = await category.get(params);
      setData(res?.data?.data?.categories);
      setTotal(res?.data?.data?.total || 0); 
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  const addOrUpdateCategory = async (values: CategoryValues): Promise<void> => {
    try {
      if (editingCategory) {
        await category.update(editingCategory.id, values);
      } else {
        await category.create(values);
      }
      getData();
      setVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error while adding/updating category:", error);
      alert(error);
    }
  };

  const editCategory = async (category: any) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setVisible(true);
  };

  const deleteCategory = async (id: number) => {
    try {
      await category.delete(id);
      message.success("Category successfully deleted!");
      getData();
    } catch (error) {
      alert(error);
    }
  };

  const goToSubCategory = (id: any) => {
    navigate(`/admin/sub-categories/${id}`);  
  };

  const handleTableChange = (pagination: any) => {
    setParams({
      ...params,
      limit: pagination.pageSize,
      page: pagination.current,
    });
  };

  const handleSearch = (e: any) => {
    setParams({
      ...params,
      search: e.target.value,
      page: 1, 
    });
  };

  const columns = [
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: any) => (
        <Space>
          <Button
            style={{ backgroundColor: "#BC8E5B", color: "white" }}
            onClick={() => {
              editCategory(record);
              setEditingCategory(null);
            }}
          >
            Edit
          </Button>
          <Button
            className="bg-red-500 text-white"
            id={record.id}
            onClick={() => deleteCategory(record.id)}
          >
            Delete
          </Button>
          <Button onClick={() => goToSubCategory(record.id)}>Next</Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button className="w-[120px]" type="primary" onClick={() => setVisible(true)}>
          Add category
        </Button>
        <Input
          className="w-[250px]"
          placeholder="Search category..."
          onChange={handleSearch} 
        />
      </div>

      <GlobalTable
        columns={columns}
        data={data}
        pagination={{
          current: params.page,
          pageSize: params.limit,
          total: total,
          showSizeChanger: true,
          pageSizeOptions: ["2", "5", "7", "10", "12"],
        }}
        handleChange={handleTableChange} 
      />

      <Modal
        title={"Add Category"}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={addOrUpdateCategory}>
          <Form.Item name="name" label="Category Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
