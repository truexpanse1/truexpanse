import React from 'react';

interface AppointmentsBlockProps {
    appointmentsCount: number;
    onAddAppointment: () => void;
    onViewAppointments: () => void;
}

const AppointmentsBlock: React.FC<AppointmentsBlockProps> = ({ appointmentsCount, onAddAppointment, onViewAppointments }) => {
    return (
        <div className="bg-brand-light-card dark:bg-brand-navy p-4 rounded-lg border border-brand-light-border dark:border-brand-gray">
            <h3 className="text-sm font-bold text-brand-red uppercase mb-2">Today's Appointments</h3>
            <div className="text-center my-4">
                <p className="text-6xl font-black text-brand-light-text dark:text-white">{appointmentsCount}</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
                <button 
                    onClick={onViewAppointments}
                    disabled={appointmentsCount === 0}
                    className="w-full bg-brand-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition text-sm disabled:bg-brand-gray disabled:cursor-not-allowed"
                >
                    View Appointments
                </button>
                <button onClick={onAddAppointment} className="w-full bg-brand-lime text-brand-ink font-bold py-2 px-4 rounded-lg hover:bg-green-400 transition text-sm">
                    + Add Appointment
                </button>
            </div>
        </div>
    );
};

export default AppointmentsBlock;