import { PaymentPage } from "@/pages_/payment-page";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
    params: { locale },
}: {
    params: { locale: string };
}) {
    const t = await getTranslations({ locale });

    return {
        title: t("payment"),
    };
}

const Page = () => {
    return <PaymentPage />;
};

export default Page;
