import { Card } from "@/components/ui/card";
import NewUserForm from "@/app/(admin)/admin/users/NewUserForm";
import { listUsers } from "@/lib/auth";

export default function UsersPage() {
  const users = listUsers();

  return (
    <>
      <h1 className="text-2xl font-black">کاربران</h1>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">
        همه حساب‌ها دسترسی کامل به پنل دارند. نخستین حساب از متغیرهای محیطی ساخته می‌شود؛ بقیه
        از همین‌جا.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-12">
        <Card className="overflow-hidden p-0 lg:col-span-7">
          <ul className="divide-y divide-line">
            {users.map((user) => (
              <li key={user.id} className="px-5 py-3.5">
                <p className="font-medium">{user.name}</p>
                <p className="num mt-0.5 text-xs text-muted" dir="ltr">
                  {user.email}
                </p>
                <p className="num mt-1 text-[11px] text-muted/70">
                  از {user.created_at.slice(0, 10)}
                </p>
              </li>
            ))}
          </ul>
        </Card>

        <div className="lg:col-span-5">
          <Card className="p-6">
            <h2 className="font-bold">افزودن حساب مدیر</h2>
            <p className="mt-2 text-xs leading-6 text-muted">
              رمز عبور پس از ساخت قابل دیدن نیست؛ آن را جایی مطمئن نگه دارید.
            </p>
            <div className="mt-5">
              <NewUserForm />
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
