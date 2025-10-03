import Link from "@/component/ui/link";

export default function Nav() {
  return (
    <div>
      <Link classNameActive="active" href={"/debug-auth"}>
        debug-auth
      </Link>
      <br />
      <Link classNameActive="active" href={"/email-verification"}>
        email-verification
      </Link>
      <br />
      <Link classNameActive="active" href={"/forgot-password"}>
        forgot-password
      </Link>
      <br />
      <Link classNameActive="active" href={"/reset-password"}>
        reset-password
      </Link>
      <br />
      <Link classNameActive="active" href={"/sign-in"}>
        sign-in
      </Link>
      <br />
      <Link classNameActive="active" href={"/sign-up"}>
        sign-up
      </Link>
      <br />
      <Link classNameActive="active" href={"/admin/dashboard"}>
        admin dashboard
      </Link>
      <br />
      <Link classNameActive="active" href={"/user/change-password"}>
        user change-password
      </Link>
      <br />
      <Link classNameActive="active" href={"/user/dashboard"}>
        user dashboard
      </Link>
      <br />
      <Link classNameActive="active" href={"/user/service-create"}>
        user service-create
      </Link>
      <br />
      <Link classNameActive="active" href={"/user/update"}>
        user update
      </Link>
      <br />
    </div>
  );
}
