const ButtonComp = ({ onClick, label }: { onClick: () => void; label: string }) => {
    return (
        <button onClick={onClick}
            className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-l dark:shadow-purple-800/80 font-medium rounded-sm text-sm px-5 py-2.5 text-center cursor-pointer transition duration-200 ease-in-out transform active:scale-90">
            {label}
        </button>
    );
};

export default ButtonComp;