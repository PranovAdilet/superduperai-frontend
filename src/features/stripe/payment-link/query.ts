import { useMutation } from "@tanstack/react-query";
import { StripeService } from "@/shared/api";

export const usePaymentLink = () => {
    return useMutation({
        mutationFn: StripeService.stripeStripeCheckoutSession,
    });
};
