export type IPaginationOptions = {
	page: number;
	limit: number;
	sortBy: string | undefined;
	sortOrder: 'asc' | 'desc' | undefined;
};
