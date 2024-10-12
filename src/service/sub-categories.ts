import https from "./config";

const subCategoryService:any = {
    create: (subCategoryData: any) => https.post("/sub-category/create", subCategoryData),
    get: (categoryId: number, params: any) => https.get(`/sub-category/search/${categoryId}`, { params }),  // Paramsni qo'shamiz
    update: (subCategoryId: number, subCategoryData: any) => https.patch(`/sub-category/update/${subCategoryId}`, subCategoryData),
    delete: (subCategoryId: number) => https.delete(`/sub-category/delete/${subCategoryId}`),
  };
  