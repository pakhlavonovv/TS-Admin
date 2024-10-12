// import { lazy, Suspense } from "react";
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
   Brand,
   Settings,
   SubCategory
} from "@pages";
import AdminLayout from '../layout/admin-layout'

// const LazyComponent = lazy(() => import("../pages/sign-in"))

const Index = () => {
   const router = createBrowserRouter(
      createRoutesFromElements(
         <Route path="/" element={<App />}>
            <Route index element={<SignIn/>}/>
            <Route path="sign-up" element={<SignUp />} />
            <Route path="admin" element={<AdminLayout />}>
               <Route path="categories" element={<Category />} />
               <Route path="brand" element={<Brand />} />
               <Route path="settings" element={<Settings />} />
               <Route path="sub-categories/:categoryId" element={<SubCategory/>}/>
            </Route>
         </Route>
      )
   );

   return <RouterProvider router={router} />;
};

export default Index;
