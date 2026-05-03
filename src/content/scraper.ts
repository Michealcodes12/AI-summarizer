
export function extractMainContent(): string {
    const mainContainer = document.querySelector('article') || document.querySelector('main');

    let extractedText: string;

    if (mainContainer) {
        extractedText = (mainContainer as HTMLElement).innerText;
    } else {
        const paragraphs = Array.from(document.querySelectorAll('p'));

        const validParagraphs = paragraphs.filter(p => p.innerText.length > 50);
        extractedText = validParagraphs.map(p => p.innerText).join('\n\n');
    }

    const cleanText = extractedText.replace(/\s+/g, ' ').trim();

    if (!cleanText) {
        throw new Error("Could not find any readable content on this page.");
    }

    return cleanText;
}