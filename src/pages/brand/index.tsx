import { Button, Input, Modal, Space, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { EditingCategory, CategoryValues } from "../../components/types"; 
import GlobalTable from "../../components/global-table"; 
import brand from "../../service/brand"; 
import { Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/es/table"; 

const Index = () => {
  const [data, setData] = useState<CategoryValues[]>([]); 
  const [total, setTotal] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false); 
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null); 
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null); 
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1,
  });

  // Function to fetch data
  const getData = async (): Promise<void> => {
    try {
      const res = await brand.get(params);
      console.log(res)
      setData(res?.data?.data?.brands    || []); 
      setTotal(res?.data?.data?.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [params]);

  const addOrUpdateCategory = async (values: CategoryValues): Promise<void> => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);  
    formData.append("category_id", values.category_id.toString());  
  
    if (file) {
      formData.append("file", file);  
    }
  
    try {
      if (editingCategory) {
        await brand.update(editingCategory.id, formData);
      } else {
        await brand.create(params);
      }
      getData();  
      setVisible(false); 
      form.resetFields(); 
      setFile(null);  
    } catch (error) {
      console.error("Error while adding/updating category:", error);
      message.error("Failed to save brand. Try again.");
    }
  };
  


  const editCategory = (category: EditingCategory): void => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      category_id: category.category_id,
      description: category.description,
    }); 
    setVisible(true);
  };

  const deleteCategory = async (id: number): Promise<void> => {
    try {
      await brand.delete(id);
      message.success("Brand successfully deleted!");
      getData();
    } catch (error) {
      console.error("Error deleting brand:", error);
      message.error("Failed to delete brand. Try again.");
    }
  };

  const goToSubCategory = (id: number): void => {
    console.log("Navigating to sub-category with ID:", id);
  };

  const handleTableChange = (pagination: PaginationConfig): void => {
    setParams((prev) => ({
      ...prev,
      limit: pagination.pageSize || 2,
      page: pagination.current || 1,
    }));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setParams({
      ...params,
      search: e.target.value,
      page: 1, 
    });
  };

  const columns: ColumnsType<CategoryValues> = [
    {
      title: "Brand Name",
      dataIndex: "name",  
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",  
      key: "description",
    },
    {
      title: "Category ID",
      dataIndex: "category_id",  
      key: "category_id",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, record: CategoryValues) => (
        <Space>
          <Button className="bg-[#BC8E5B] text-white" onClick={() => editCategory(record)}>Edit</Button>
          <Button className="bg-red-500 text-white" onClick={() => deleteCategory(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];


  return (
    <>
      <div className="flex items-center gap-2 mb-4">
        <Button className="w-[120px]" type="primary" onClick={() => setVisible(true)}>
          Add Brand
        </Button>
        <Input
          className="w-[250px]"
          placeholder="Search brand..."
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
        title={editingCategory ? "Edit Brand" : "Add Brand"} // Conditional title
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={addOrUpdateCategory}>
          <Form.Item name="name" label="Brand Name" rules={[{ required: true, message: "Please input the brand name!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please input the description!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="Category ID" rules={[{ required: true, message: "Please input the category ID!" }]}>
            <Input />
          </Form.Item>
          <Upload
            name="file"
            beforeUpload={(file) => {
              setFile(file);
              return false; // Prevent automatic upload
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form>
      </Modal>
    </>
  );
};

export default Index;
