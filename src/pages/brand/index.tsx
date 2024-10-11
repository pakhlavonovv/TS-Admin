import { Button, Input, Modal, Space, message, Upload } from "antd";
import { useEffect, useState } from "react";
import { EditingCategory, CategoryValues } from "../../components/types"; // Types
import GlobalTable from "../../components/global-table"; // GlobalTable component
import brand from "../../service/brand"; // brand service
import { Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { ColumnsType, TablePaginationConfig } from "antd/es/table"; // Type imports for table

const Index = () => {
  const [data, setData] = useState<CategoryValues[]>([]); // Specify the type of the data array
  const [total, setTotal] = useState<number>(0); // total number of categories
  const [visible, setVisible] = useState<boolean>(false); // Modal visibility
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null); // File state
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null); // For editing
  const [params, setParams] = useState({
    search: "",
    limit: 2,
    page: 1,
  });

  // Function to fetch data
  const getData = async (): Promise<void> => {
    try {
      const res = await brand.get(params);
      setData(res?.data?.data?.categories || []); // Fallback if data is undefined
      setTotal(res?.data?.data?.total || 0);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // useEffect to trigger data fetch on param changes
  useEffect(() => {
    getData();
  }, [params]);

  // Function to handle adding or updating a category
  const addOrUpdateCategory = async (values: CategoryValues): Promise<void> => {
    const formData = new FormData();
    formData.append("name", values.name);
    if (file) {
        formData.append("file", file);
    }
    
    try {
        const token = localStorage.getItem("token"); // Tokenni localStorage yoki contextdan oling

        const config = {
            headers: {
                "Authorization": `Bearer ${token}`, // Tokenni headerda jo'nating
                "Content-Type": "multipart/form-data"
            }
        };

        if (editingCategory) {
            await brand.update(editingCategory.id, formData, config); // Update so'rov
        } else {
            await brand.create(formData, config); // Create so'rov
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


  // Edit category handler
  const editCategory = (category: EditingCategory): void => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      category_id: category.category_id,
      description: category.description,
    }); // Populate form with brand details
    setVisible(true);
  };

  // Delete category handler
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

  // Go to sub-category handler (example)
  const goToSubCategory = (id: number): void => {
    console.log("Navigating to sub-category with ID:", id);
  };

  // Handle table pagination and sorting
  const handleTableChange = (pagination: PaginationConfig): void => {
    setParams((prev) => ({
      ...prev,
      limit: pagination.pageSize || 2,
      page: pagination.current || 1,
    }));
  };

  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setParams({
      ...params,
      search: e.target.value,
      page: 1, // Reset to first page after search
    });
  };

  // Table column definitions with types
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
          <Button
            style={{ backgroundColor: "#BC8E5B", color: "white" }}
            onClick={() => {
              editCategory(record);
              setEditingCategory(null); // Clear after edit
            }}
          >
            Edit
          </Button>
          <Button className="bg-red-500 text-white" onClick={() => deleteCategory(record.id)}>
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
