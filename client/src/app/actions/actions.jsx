'use server'
import { signIn, signOut } from "../../auth";
export async function doSocialLogin(formData) {
    const action = formData.get('action');
    const userType = formData.get('userType');
    await signIn(action, { redirectTo: userType==='student'?"/student":"/teacher"})
}

export async function doLogout() {
    await signOut({ redirectTo: '/' })
}