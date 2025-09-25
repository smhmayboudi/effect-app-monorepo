import ActiveLink from "@/component/active-link";

export default function Nav() {
  return (
    <div>
      <ActiveLink activeClassName="active" href={"/debug-auth"}>
        debug-auth
      </ActiveLink>
      &nbsp;
      <br />
      <ActiveLink activeClassName="active" href={"/forgot-password"}>
        forgot-password
      </ActiveLink>
      &nbsp;
      <br />
      <ActiveLink activeClassName="active" href={"/sign-in"}>
        sign-in
      </ActiveLink>
      &nbsp;
      <br />
      <ActiveLink activeClassName="active" href={"/sign-up"}>
        sign-up
      </ActiveLink>
      <br />
      <ActiveLink activeClassName="active" href={"/admin/dashboard"}>
        admin dashboard
      </ActiveLink>
      &nbsp;
      <br />
      <ActiveLink activeClassName="active" href={"/user/change-password"}>
        user change-password
      </ActiveLink>
      <br />
      <ActiveLink activeClassName="active" href={"/user/dashboard"}>
        user dashboard
      </ActiveLink>
      <br />
      <ActiveLink activeClassName="active" href={"/user/service-create"}>
        user service-create
      </ActiveLink>
      <br />
      <ActiveLink activeClassName="active" href={"/user/update"}>
        user update
      </ActiveLink>
      <br />
    </div>
  );
}
