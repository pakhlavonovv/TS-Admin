import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
 } from "react-router-dom";
 import App from "../App";
 import {
    SignIn,
    SignUp,
    Category,
 } from "@pages";
 import AdminLayout from '../layout/admin-layout'
 
 const Index = () => {
    const router = createBrowserRouter(
       createRoutesFromElements(
          <Route path="/" element={<App />}>
             <Route index element={<SignIn/>}/>
             <Route path="sign-up" element={<SignUp/>}/>
             <Route path="admin" element={<AdminLayout/>}>
               <Route path="categories" element={<Category/>}/>
             </Route>
          </Route> 
       )
    );
 
    return <RouterProvider router={router} />;
 };
 
 export default Index;
 