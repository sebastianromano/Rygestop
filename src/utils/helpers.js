export const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-4 py-2 rounded-full text-sm shadow-lg';
        notification.textContent = 'Kopieret til udklipsholder';
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
};

export const formatDate = (date) => {
    return date.toISOString().split('T')[0];
};

export const calculateDaysBetween = (startDate, endDate) => {
    return Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24));
};
