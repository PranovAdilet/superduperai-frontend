export type PageProps<
    ParamsT = Record<string, any>,
    SearchParamsT = Record<string, string | string[] | undefined>,
> = {
    params: ParamsT;
    searchParams: SearchParamsT;
};
