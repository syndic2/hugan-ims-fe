import { useState, useCallback } from 'react';

import Card from '../../components/Card/Card';
import BackButton from '../../components/BackButton/BackButton';
import Divider from '../../components/Divider/Divider';
import Spinner from '../../components/Spinner/Spinner';

import AddEditSupplierForm from './components/AddEditSupplierForm';

const AddSupplier: React.FC = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleIsFetching = useCallback((isFetching: boolean) => setIsFetching(isFetching), []);

  return (
    <div className="relative">
      <Card>
        <div className="flex flex-col gap-y-5">
          <div className="flex items-center gap-x-4 pt-6 px-7.5">
            <BackButton path={'/supplier'} label={'Daftar Supplier'} />
            <Divider direction={'VERTICAL'} />
            <span className="font-semibold text-title-xsm">
              Tambah Supplier
            </span>
          </div>
          <Divider direction={'HORIZONTAL'} classNames={'border-stroke'} />
          <AddEditSupplierForm
            handleIsFetching={handleIsFetching}
          />
        </div>
      </Card>
      {isFetching ? <Spinner /> : null}
    </div>
  );
};

export default AddSupplier;
