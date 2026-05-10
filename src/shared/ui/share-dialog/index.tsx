"use client";

import { useModal } from "@/shared/store";
import { Button, Dialog, Flex, Text } from "@radix-ui/themes";
import { type FC, useState, type ReactNode } from "react";

type Props = {
    projectId?: string;
};

export const ShareDialog: FC<Props> = () => {
    const { isOpen, type, close } = useModal();
    const isShareDialogOpen = isOpen && type === "shareDialog";

    const [copied, setCopied] = useState(false);

    const previewUrl = window.location.href;

    const handleShare = (baseUrl: string) => {
        const shareUrl = `${baseUrl}${encodeURIComponent(previewUrl)}`;
        window.open(shareUrl, "_blank");
    };

    const handleCopy = async () => {
        const inputValue = previewUrl;
        try {
            await navigator.clipboard.writeText(inputValue);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch (error: unknown) {
            console.error("Failed to copy text: ", error);
        }
    };
    return (
        <Dialog.Root
            open={isShareDialogOpen}
            onOpenChange={close}
        >
            <Dialog.Content>
                <Dialog.Title
                    align="center"
                    className="text-xl md:text-2xl"
                >
                    Share this link
                </Dialog.Title>
                <Text
                    align="center"
                    mt="2"
                    as="p"
                >
                    You can share it via the following platforms:
                </Text>
                <Flex
                    justify="center"
                    direction="column"
                    gap="4"
                    my="4"
                >
                    <Flex
                        justify="center"
                        gap="5"
                    >
                        {shareOptions.map(({ title, icon, url }) => (
                            <ShareButton
                                key={title}
                                title={title}
                                icon={icon}
                                onClick={() => {
                                    handleShare(url);
                                }}
                            />
                        ))}
                    </Flex>
                </Flex>
                <Flex
                    gap="3"
                    align="center"
                    className="rounded-xl border border-gray-700"
                    p="2"
                >
                    <input
                        type="text"
                        value={previewUrl}
                        className="w-full bg-transparent p-2 outline-none"
                        onChange={() => {
                            return;
                        }}
                    />

                    <Button
                        onClick={handleCopy}
                        className="w-[70px]"
                    >
                        <Text weight="medium">
                            {copied ? "Copied!" : "Copy"}
                        </Text>
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
};

const ShareButton = ({
    title,
    icon,
    onClick,
}: {
    title: string;
    icon: ReactNode;
    onClick: () => void;
}) => (
    <Flex
        direction="column"
        gap="2"
        role="button"
        onClick={onClick}
        align="center"
    >
        {icon}
        <Text>{title}</Text>
    </Flex>
);

const shareOptions = [
    {
        title: "Telegram",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#29b6f6"
                    d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"
                ></path>
                <path
                    fill="#fff"
                    d="M33.95,15l-3.746,19.126c0,0-0.161,0.874-1.245,0.874c-0.576,0-0.873-0.274-0.873-0.274l-8.114-6.733 l-3.97-2.001l-5.095-1.355c0,0-0.907-0.262-0.907-1.012c0-0.625,0.933-0.923,0.933-0.923l21.316-8.468 c-0.001-0.001,0.651-0.235,1.126-0.234C33.667,14,34,14.125,34,14.5C34,14.75,33.95,15,33.95,15z"
                ></path>
            </svg>
        ),
        url: "https://t.me/share/url?url=",
    },
    {
        title: "Whatsapp",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="50"
                height="50"
                viewBox="0 0 80 80"
            >
                <path
                    fill="#f2faff"
                    d="M7.904,58.665L7.8,58.484c-3.263-5.649-4.986-12.102-4.983-18.66 C2.826,19.244,19.577,2.5,40.157,2.5C50.14,2.503,59.521,6.391,66.57,13.446C73.618,20.5,77.5,29.879,77.5,39.855 c-0.01,20.583-16.76,37.328-37.34,37.328c-6.247-0.003-12.418-1.574-17.861-4.543l-0.174-0.096L2.711,77.636L7.904,58.665z"
                ></path>
                <path
                    fill="#788b9c"
                    d="M40.157,3L40.157,3c9.85,0.003,19.105,3.838,26.059,10.799C73.17,20.76,77,30.013,77,39.855 c-0.009,20.307-16.536,36.828-36.855,36.828c-6.149-0.003-12.237-1.553-17.606-4.482l-0.349-0.19l-0.384,0.101l-18.384,4.82 l4.91-17.933l0.11-0.403l-0.209-0.362c-3.22-5.574-4.92-11.94-4.917-18.41C3.326,19.52,19.852,3,40.157,3 M40.157,2 C19.302,2,2.326,18.969,2.317,39.824C2.313,46.49,4.055,53,7.367,58.735L2,78.339l20.06-5.26 c5.526,3.015,11.751,4.601,18.084,4.604h0.016c20.855,0,37.831-16.969,37.84-37.827c0-10.108-3.933-19.613-11.077-26.764 C59.78,5.942,50.28,2.003,40.157,2L40.157,2z"
                ></path>
                <path
                    fill="#79ba7e"
                    d="M39.99,70c-5.009-0.003-9.965-1.263-14.332-3.646l-2.867-1.564l-3.159,0.828l-6.482,1.699	l1.659-6.061l0.907-3.312l-1.718-2.974C11.38,50.437,9.997,45.255,10,39.986C10.007,23.453,23.464,10.002,39.997,10	c8.022,0.003,15.558,3.126,21.221,8.793C66.881,24.461,70,31.998,70,40.011C69.992,56.547,56.535,70,39.99,70z"
                ></path>
                <path
                    fill="#fff"
                    d="M56.561,47.376c-0.9-0.449-5.321-2.626-6.143-2.924c-0.825-0.301-1.424-0.449-2.023,0.449	c-0.599,0.9-2.322,2.924-2.845,3.523c-0.524,0.599-1.048,0.674-1.948,0.226c-0.9-0.449-3.797-1.4-7.23-4.462	c-2.674-2.382-4.478-5.327-5.001-6.227c-0.524-0.9-0.057-1.385,0.394-1.834c0.403-0.403,0.9-1.051,1.349-1.575	c0.449-0.524,0.599-0.9,0.9-1.5c0.301-0.599,0.151-1.126-0.075-1.575c-0.226-0.449-2.023-4.875-2.773-6.673	c-0.729-1.752-1.472-1.515-2.023-1.542c-0.524-0.027-1.123-0.03-1.722-0.03c-0.599,0-1.575,0.226-2.397,1.126	c-0.822,0.9-3.147,3.074-3.147,7.498s3.222,8.699,3.671,9.298c0.449,0.599,6.338,9.678,15.36,13.571	c2.144,0.924,3.821,1.478,5.125,1.894c2.153,0.684,4.113,0.587,5.664,0.355c1.728-0.259,5.321-2.174,6.067-4.273	c0.75-2.099,0.75-3.899,0.524-4.273C58.06,48.051,57.461,47.825,56.561,47.376z"
                ></path>
            </svg>
        ),
        url: "https://api.whatsapp.com/send?text=",
    },
    {
        title: "LinkedIn",
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="50"
                height="50"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#0288D1"
                    d="M42,37c0,2.762-2.238,5-5,5H11c-2.761,0-5-2.238-5-5V11c0-2.762,2.239-5,5-5h26c2.762,0,5,2.238,5,5V37z"
                ></path>
                <path
                    fill="#FFF"
                    d="M12 19H17V36H12zM14.485 17h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99C24.957 25.543 25 26.511 25 27v9h-5V19h5v2.616C25.721 20.5 26.85 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36 36 36z"
                ></path>
            </svg>
        ),
        url: "https://www.linkedin.com/shareArticle?url=",
    },
    // {
    //     title: "Gmail",
    //     icon: (
    //         <svg
    //             xmlns="http://www.w3.org/2000/svg"
    //             x="0px"
    //             y="0px"
    //             width="50"
    //             height="50"
    //             viewBox="0 0 48 48"
    //         >
    //             <path
    //                 fill="#4caf50"
    //                 d="M45,16.2l-5,2.75l-5,4.75L35,40h7c1.657,0,3-1.343,3-3V16.2z"
    //             ></path>
    //             <path
    //                 fill="#1e88e5"
    //                 d="M3,16.2l3.614,1.71L13,23.7V40H6c-1.657,0-3-1.343-3-3V16.2z"
    //             ></path>
    //             <polygon
    //                 fill="#e53935"
    //                 points="35,11.2 24,19.45 13,11.2 12,17 13,23.7 24,31.95 35,23.7 36,17"
    //             ></polygon>
    //             <path
    //                 fill="#c62828"
    //                 d="M3,12.298V16.2l10,7.5V11.2L9.876,8.859C9.132,8.301,8.228,8,7.298,8h0C4.924,8,3,9.924,3,12.298z"
    //             ></path>
    //             <path
    //                 fill="#fbc02d"
    //                 d="M45,12.298V16.2l-10,7.5V11.2l3.124-2.341C38.868,8.301,39.772,8,40.702,8h0 C43.076,8,45,9.924,45,12.298z"
    //             ></path>
    //         </svg>
    //     ),
    //     url: "https://mail.google.com/mail/?view=cm&fs=1&tf=1&body=",
    // },
];
