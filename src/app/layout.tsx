import { Inter } from "next/font/google";

import type { ReactNode } from "react";

import "@/shared/styles/index.scss";

const inter = Inter({ subsets: ["latin"] });

type Props = {
    children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
    return (
        <html
            lang="en"
            // eslint-disable-next-line tailwindcss/no-custom-classname
            className="dark"
        >
            <body className={inter.className}>{children}</body>
        </html>
    );
}
