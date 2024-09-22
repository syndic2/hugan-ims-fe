const Spinner: React.FC = () => {
  return (
    <div className="absolute top-0 z-999 flex items-center justify-center w-full h-full bg-white bg-opacity-40">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
  );
};

export default Spinner;
