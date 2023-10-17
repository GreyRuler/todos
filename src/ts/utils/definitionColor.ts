export function definitionColorRed(massCurrent: number, duration: number, countColor: number) {
	return massCurrent * countColor - Math.round(massCurrent * duration * countColor);
}

export function definitionColorGreen(massCurrent: number, duration: number, countColor: number) {
	return Math.round(massCurrent * duration * countColor);
}
