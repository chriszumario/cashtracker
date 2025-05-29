import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default async function ChangePasswordPage() {
  return (
    <>
      <h1 className="font-black text-3xl text-purple-950 my-3">Cambiar Password</h1>
      <p className="text-lg font-semibold mb-6">Aquí puedes cambiar tu {''}
        <span className="text-amber-500">password</span>
      </p>
      <ChangePasswordForm />
    </>
  )
}
