export const TravelOptions = ['travel-north', 'travel-east', 'travel-south', 'travel-west'] as const;
export type TravelOption = typeof TravelOptions[number]
export function isTravelOption(code: string): code is TravelOption {
    return TravelOptions.includes(code as TravelOption);
}