import https from "./config";
import { AuthRequest } from "@types";
const auth: AuthRequest = {
   sign_in: (data:any) => https.post("/auth/sign-in", data),
   sign_up: (data:any) => https.post("/auth/admin/sign-up", data),
};

export default auth;
