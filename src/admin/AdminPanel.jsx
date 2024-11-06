import React from 'react';
import { initAdminStyles } from './adminStyles';
import { handleDateSimulation, clearStorage, toggleDebugMode } from './adminUtils';

function AdminPanel() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [modalConfig, setModalConfig] = React.useState({
        title: '',
        message: '',
        action: null
    });

    React.useEffect(() => {
        initAdminStyles();
    }, []);

    const showConfirm = (title, message, action) => {
        setModalConfig({ title, message, action });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalConfig({ title: '', message: '', action: null });
    };

    const executeAction = () => {
        modalConfig.action();
        closeModal();
    };

    const adminActions = [
        {
            label: '⏰ Future Date (+1 day)',
            action: () => showConfirm(
                'Simulate Future Date',
                'Move time forward by 1 day?',
                () => handleDateSimulation(1)
            )
        },
        {
            label: '📅 Past Date (-1 day)',
            action: () => showConfirm(
                'Simulate Past Date',
                'Move time backward by 1 day?',
                () => handleDateSimulation(-1)
            )
        },
        {
            label: '🔄 Reset Date',
            action: () => showConfirm(
                'Reset Date',
                'Reset to current time?',
                () => handleDateSimulation(0)
            )
        },
        {
            label: '🗑️ Clear Storage',
            action: () => showConfirm(
                'Clear Storage',
                'Clear all stored data?',
                clearStorage
            )
        },
        {
            label: '📊 View Storage',
            action: () => console.log('LocalStorage:', { ...localStorage })
        },
        {
            label: '🐛 Toggle Debug',
            action: toggleDebugMode
        }
    ];

    return (
        <>
            <button id="admin-trigger" className="fixed top-4 right-4 z-50 bg-transparent border-none cursor-pointer opacity-20 hover:opacity-100 transition-opacity p-2 text-xl">
                👤
            </button>

            <div id="admin-panel" className="fixed top-16 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-2 hidden z-50 min-w-[200px]">
                {adminActions.map((action, index) => (
                    <button
                        key={index}
                        onClick={action.action}
                        className="block w-full px-4 py-2 my-1 text-left hover:bg-gray-100 rounded cursor-pointer border-none bg-transparent"
                    >
                        {action.label}
                    </button>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-11/12">
                        <h3 className="text-lg font-semibold mb-2">{modalConfig.title}</h3>
                        <p className="text-gray-600 mb-4">{modalConfig.message}</p>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={executeAction}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AdminPanel;
