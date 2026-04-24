export function cleanTrailingPunctuation(text: string) {
    return text.replace(/[.,]*$/g, '');
}
