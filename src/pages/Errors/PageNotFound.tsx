import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';

const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  const onClickBack = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen px-8">
      <div className="text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something's missing.</p>
        <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
        <Button
          label={'Kembali ke Halaman Awal'}
          classNames={'!w-fit mx-auto'}
          handleClick={onClickBack}
        />
      </div>
    </div>
  );
};

export default PageNotFound;
