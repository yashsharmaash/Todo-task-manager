import { Plus } from 'lucide-react';

const EmptyState = ({ title, description, actionLabel, onAction }) => {
    return (
        <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-gray-300">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
                <Plus className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
            <p className="text-gray-500 mb-6 max-w-sm mx-auto">{description}</p>
            {onAction && (
                <button
                    onClick={onAction}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default EmptyState;
