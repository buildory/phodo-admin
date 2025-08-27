import { AdminLayout } from "@/components/layout/admin-layout";
import { getCurrentUser } from "@/lib/auth";

export default async function AdminLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  let user = null;
  
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.log('User not authenticated');
  }

  return (
    <AdminLayout user={user}>
      {children}
    </AdminLayout>
  );
}
