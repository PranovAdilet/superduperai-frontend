import { ResponsiveProvider } from "@/shared/providers";
import type { FC, PropsWithChildren } from "react";

const Layout: FC<PropsWithChildren> = ({ children }) => {
    return <ResponsiveProvider>{children}</ResponsiveProvider>;
};

export default Layout;
