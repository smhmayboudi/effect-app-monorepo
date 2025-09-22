import { sleep } from "@/util/time";

export default function Loading() {
  sleep(10000);
  return <h1>LOADING...</h1>;
}
