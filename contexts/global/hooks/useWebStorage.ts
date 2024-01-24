import { tokenConnector } from "@/utils/web-storage/token";
import { useSyncWebStorage } from "./useSyncWebStorage";

export const useWebStorage = () => {
  const token = useSyncWebStorage(tokenConnector);

  return { token };
};
