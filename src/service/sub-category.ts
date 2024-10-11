import https from "./config";
const subCategoryService = {
   create: (subCategoryData) => https.post("/sub-category/create", subCategoryData),
   get: (categoryId) => https.get(`/sub-category/search/${categoryId}`),
   update: (subCategoryId, subCategoryData) => https.patch(`/sub-category/update/${subCategoryId}`, subCategoryData),
   delete: (subCategoryId) => https.delete(`/sub-category/delete/${subCategoryId}`),
};

export default subCategoryService;
