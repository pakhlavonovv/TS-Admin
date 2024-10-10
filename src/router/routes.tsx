interface AdminType {
    content: string,
    path: string
}

const admin:AdminType[] =  [
    {
        content: "Categories",
        path: "/admin/categories",
    }, 
    {
        content: "Brand",
        path: "/admin/brand",
    }
]
export { admin }