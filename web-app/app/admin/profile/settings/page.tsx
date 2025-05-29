import ProfileForm from "@/components/profile/ProfileForm";
import { verifySession } from "@/src/auth/dal";

export default async function EditProfilePage() {

  const { user } = await verifySession()

  return (
    <>
      <h1 className="font-black text-3xl text-purple-950 my-3">Actualizar Perfil</h1>
      <p className="text-lg font-semibold mb-6">Aquí puedes cambiar los datos de tu {''}
        <span className="text-amber-500">perfil</span>
      </p>

      <ProfileForm
        user={user}
      />
    </>
  )
}