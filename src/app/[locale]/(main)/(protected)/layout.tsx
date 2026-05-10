import type { FC, PropsWithChildren } from "react";
import { AuthProvider } from "@/features/auth";

const Layout: FC<PropsWithChildren> = ({ children }) => {
    // return <AuthProvider>{children}</AuthProvider>;
    return <>{children}</>;
};

export default Layout;
