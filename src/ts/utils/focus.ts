export default function setFocusToEnd(element: HTMLElement) {
	const selection = window.getSelection();
	const range = document.createRange();
	range.selectNodeContents(element);
	range.collapse(false);
	selection?.removeAllRanges();
	selection?.addRange(range);
	element.focus();
}
