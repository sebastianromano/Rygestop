export const handleDateSimulation = (days) => {
    if (days === 0) {
        localStorage.removeItem('timeOffset');
    } else {
        const currentOffset = parseInt(localStorage.getItem('timeOffset') || '0');
        const oneDayMs = 24 * 60 * 60 * 1000;
        const newOffset = currentOffset + (days * oneDayMs);
        localStorage.setItem('timeOffset', newOffset.toString());
    }
    window.location.reload();
};

export const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
};

export const toggleDebugMode = () => {
    const current = localStorage.getItem('debugMode') === 'true';
    localStorage.setItem('debugMode', (!current).toString());
    window.location.reload();
};

export const initDateSimulation = () => {
    const timeOffset = localStorage.getItem('timeOffset');
    if (timeOffset) {
        const RealDate = Date;
        const offset = parseInt(timeOffset);

        Date = class extends RealDate {
            constructor(...args) {
                if (args.length === 0) {
                    super();
                    this.setTime(this.getTime() + offset);
                    return this;
                }
                return new RealDate(...args);
            }

            static now() {
                return new RealDate().getTime() + offset;
            }
        };

        Date.parse = RealDate.parse.bind(RealDate);
        Date.UTC = RealDate.UTC.bind(RealDate);
    }
};
