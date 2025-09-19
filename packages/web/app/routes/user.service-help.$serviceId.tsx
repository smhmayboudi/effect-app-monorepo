import { Link } from "react-router";
import type { Route } from "./+types/user.service-help.$serviceId";

export default function UserServiceHelp({ params }: Route.ComponentProps) {
  return (
    <div>
      <h2>User Service Help</h2>
      <Link to={`http://localhost:3001/auth/${params.serviceId}/reference`}>
        Reference
      </Link>
    </div>
  );
}
