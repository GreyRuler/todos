/**
 * Находит продожительность на данный момент
 * @param dateStart Дата начала
 * @param dateEnd Дата окончания
 */
const durationDate = (dateStart: number, dateEnd: number) => {
	const dateCommon = dateEnd - dateStart;
	const dateDifference = dateEnd - Date.now();
	return 1 - dateDifference / dateCommon;
};
export default durationDate;
