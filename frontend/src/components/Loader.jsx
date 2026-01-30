import clsx from 'clsx';

const Loader = ({ count = 3, className }) => {
    return (
        <div className={clsx("animate-pulse space-y-4", className)}>
            {[...Array(count)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-24 w-full"></div>
            ))}
        </div>
    );
};

export default Loader;
