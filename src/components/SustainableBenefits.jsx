import React from 'react';
import { SUSTAINABLE_BENEFITS } from '../data/benefits';

function SustainableBenefits({ selectedBenefit, setSelectedBenefit }) {
    return (
        <div className="w-full bg-white rounded-lg p-4">
            <div className="flex flex-wrap justify-center gap-3">
                {SUSTAINABLE_BENEFITS.map((benefit) => (
                    <button
                        key={benefit.id}
                        onClick={() => setSelectedBenefit(selectedBenefit === benefit.id ? null : benefit.id)}
                        className={`w-16 h-16 rounded-full
                           ${selectedBenefit === benefit.id ? benefit.activeColor : benefit.bgColor}
                           border ${benefit.borderColor}
                           flex flex-col items-center justify-center
                           transition-all duration-200 ease-in-out
                           hover:scale-105 focus:outline-none
                           focus:ring-2 focus:ring-offset-2 ${benefit.borderColor}`}
                    >
                        <span className={`text-xs font-medium ${benefit.color}`}>
                            {benefit.title}
                        </span>
                    </button>
                ))}
            </div>

            <div className="overflow-hidden transition-all duration-200 ease-in-out">
                {selectedBenefit && (
                    <div className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-100">
                        {SUSTAINABLE_BENEFITS.map((benefit) => (
                            benefit.id === selectedBenefit && (
                                <div key={benefit.id} className="space-y-2">
                                    <h3 className={`font-medium ${benefit.color}`}>{benefit.title}</h3>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div>
                                            <span className="font-medium">Kort sigt </span>
                                            <span className="text-gray-500">({benefit.shortTerm.split(":")[0]}): </span>
                                            {benefit.shortTerm.split(": ")[1]}
                                        </div>
                                        <div>
                                            <span className="font-medium">Lang sigt </span>
                                            <span className="text-gray-500">({benefit.longTerm.split(":")[0]}): </span>
                                            {benefit.longTerm.split(": ")[1]}
                                        </div>
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SustainableBenefits;
