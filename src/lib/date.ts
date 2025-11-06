export const formatDate = (isoDate: string | undefined): string => {
    if (!isoDate) return 'N/A';

    try {
        const date = new Date(isoDate);
        if (isNaN(date.getTime())) return 'Invalid date';

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        return 'Invalid date';
    }
};