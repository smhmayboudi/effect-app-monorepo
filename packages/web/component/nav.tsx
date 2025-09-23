import Link from "next/link";

export default function Nav() {
  return (
    <div>
      <Link href={"/debug-auth"}>debug-auth</Link>&nbsp;
      <br />
      <Link href={"/forgot-password"}>forgot-password</Link>&nbsp;
      <br />
      <Link href={"/sign-in"}>sign-in</Link>&nbsp;
      <br />
      <Link href={"/sign-up"}>sign-up</Link>
      <br />
      <Link href={"/admin/dashboard"}>admin dashboard</Link>&nbsp;
      <br />
      <Link href={"/user/change-password"}>user change-password</Link>
      <br />
      <Link href={"/user/dashboard"}>user dashboard</Link>
      <br />
      <Link href={"/user/service-create"}>user service-create</Link>
      <br />
      <Link href={"/user/update"}>user update</Link>
      <br />
    </div>
  );
}
