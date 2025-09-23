import type { Metadata } from "next";
import Link from "next/link";

export async function generateMetadata(
  props: PageProps<"/user/service-help/[serviceId]">
) {
  const { serviceId } = await props.params;

  return Promise.resolve({
    title: `user service-help ${serviceId}`,
    description: `user service-help ${serviceId}`,
  } as Metadata);
}

// export async function generateStaticParams() {
//   // SELECT serviceId from tbl_service
//   const results = [{}]
//   return results.map(value => ({ serviceId: value.service_id }));
// }

export default async function Page(
  props: PageProps<"/user/service-help/[serviceId]">
) {
  const { serviceId } = await props.params;

  return (
    <div>
      <h2>User Service Help</h2>
      <Link href={`http://localhost:3001/auth/${serviceId}/reference`}>
        Reference
      </Link>
    </div>
  );
}
