import React from 'react';
import SimpleChart from './SimpleChart';
import SustainableBenefits from './SustainableBenefits';
import {
    MinusIcon,
    PlusIcon,
    ShareIcon,
    HeartIcon,
    WalletIcon,
    TrendingUpIcon
} from '../icons';
import {
    STORAGE_KEY,
    INITIAL_DAILY_LIMIT,
    DAYS_TO_QUIT,
    PREVIOUS_DAILY_CONSUMPTION,
    PRICE_PER_PACK,
    CIGARETTES_PER_PACK
} from '../config/constants';
import { BENEFITS } from '../data/benefits';
import { copyToClipboard, formatDate, calculateDaysBetween } from '../utils/helpers';

function RygestopApp() {
    const [selectedBenefit, setSelectedBenefit] = React.useState(null);
    const [data, setData] = React.useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : {
            startDate: new Date().toISOString(),
            dailyData: {},
            totalCigarettes: 0
        };
    });

    React.useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }, [data]);

    const getDayNumber = () => calculateDaysBetween(new Date(data.startDate), new Date());
    const getDailyLimit = () => Math.max(0, INITIAL_DAILY_LIMIT - Math.floor(getDayNumber() * (INITIAL_DAILY_LIMIT / DAYS_TO_QUIT)));
    const getTodayCount = () => {
        const today = formatDate(new Date());
        return data.dailyData[today] || 0;
    };

    const updateCount = (increment) => {
        const today = formatDate(new Date());
        const currentCount = data.dailyData[today] || 0;
        const newCount = Math.max(0, currentCount + increment);
        setData(prev => ({
            ...prev,
            dailyData: { ...prev.dailyData, [today]: newCount },
            totalCigarettes: Math.max(0, prev.totalCigarettes + increment)
        }));
    };

    const calculateSavings = () => {
        const dayNumber = getDayNumber();
        const todayCount = getTodayCount();
        const pricePerCig = PRICE_PER_PACK / CIGARETTES_PER_PACK;
        const dailySaved = (PREVIOUS_DAILY_CONSUMPTION - todayCount) * pricePerCig;
        const theoreticalCost = dayNumber * PREVIOUS_DAILY_CONSUMPTION * pricePerCig;
        let actualTotalCigarettes = 0;
        Object.values(data.dailyData).forEach(count => { actualTotalCigarettes += count; });
        const actualCost = actualTotalCigarettes * pricePerCig;
        return {
            daily: Math.max(0, dailySaved).toFixed(0),
            total: Math.max(0, theoreticalCost - actualCost).toFixed(0)
        };
    };

    const shareProgress = async () => {
        const shareText = `📅 Dag ${getDayNumber()} af ${DAYS_TO_QUIT}
🎯 I dag: ${getTodayCount()} (mål: < ${getDailyLimit()})
💰 Sparet i alt: ${calculateSavings().total} kr`.trim();
        if (navigator.share) {
            try {
                await navigator.share({ title: '🚭 Rygestop 🚭', text: shareText });
            } catch (error) {
                if (error.name !== 'AbortError') copyToClipboard(shareText);
            }
        } else {
            copyToClipboard(shareText);
        }
    };

    const getHealthBenefit = () => BENEFITS.filter(b => b.days <= getDayNumber()).pop()?.benefit || "Start din rejse mod et sundere liv!";

    const getChartData = () => [...Array(7)].map((_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = formatDate(date);
        return {
            date: date.toLocaleDateString('da-DK', { weekday: 'short' }),
            count: data.dailyData[dateStr] || 0,
            limit: Math.max(0, INITIAL_DAILY_LIMIT - Math.floor((getDayNumber() - i) * (INITIAL_DAILY_LIMIT / DAYS_TO_QUIT)))
        };
    }).reverse();

    const savings = calculateSavings();

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
            <div className="max-w-md mx-auto space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">Rygestop</h1>
                    <p className="text-blue-600">Dag {getDayNumber()} af {DAYS_TO_QUIT}</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg space-y-4">
                    <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">I dag</p>
                        <div className="flex items-center justify-center space-x-4 my-4">
                            <button onClick={() => updateCount(-1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                <MinusIcon />
                            </button>
                            <span className="text-3xl font-bold text-blue-600">{getTodayCount()}</span>
                            <button onClick={() => updateCount(1)} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
                                <PlusIcon />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">Dagens mål: {getDailyLimit()} eller mindre</p>
                        <button onClick={shareProgress} className="w-full flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                            <ShareIcon />
                            <span className="font-medium">Del din fremgang</span>
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-700">I dag</p>
                            <WalletIcon />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{savings.daily} kr</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                        <div className="flex items-center justify-between mb-2">
                            <p className="font-semibold text-gray-700">Total</p>
                            <TrendingUpIcon />
                        </div>
                        <p className="text-2xl font-bold text-green-600">{savings.total} kr</p>
                    </div>
                </div>

                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                    <div className="flex items-center gap-2">
                        <HeartIcon />
                        <p className="font-medium text-green-800">{getHealthBenefit()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Din fremgang</h2>
                    <div className="h-64">
                        <SimpleChart data={getChartData()} maxValue={INITIAL_DAILY_LIMIT} />
                    </div>
                </div>

                <SustainableBenefits
                    selectedBenefit={selectedBenefit}
                    setSelectedBenefit={setSelectedBenefit}
                />
            </div>
        </div>
    );
}

export default RygestopApp;
