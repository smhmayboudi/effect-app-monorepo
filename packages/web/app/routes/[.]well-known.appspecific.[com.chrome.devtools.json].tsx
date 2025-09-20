import * as path from "node:path";
import { v7 } from "uuid";

export const loader = async () => ({
  workspace: {
    root: path.resolve(),
    uuid: v7(),
  },
});
