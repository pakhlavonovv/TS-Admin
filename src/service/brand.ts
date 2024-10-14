import https from "./config";
const brand = {
   create: (data:any) => https.post("/brand/create", data),
   get: (params:any) => https.get("/brand/search", {params}),
   update: (id:number, data:any) => https.patch(`/brand/update/${id}`, data),
   delete: (id:number) => https.delete(`/brand/delete/${id}`),
};

export default brand;
