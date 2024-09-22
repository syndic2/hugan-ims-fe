import { useState, useCallback } from 'react';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import Spinner from '../../components/Spinner/Spinner';

import AddEditCustomerForm from './components/AddEditCustomerForm';

const AddCustomer: React.FC = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const handleIsFetching = useCallback((isFetching: boolean) => setIsFetching(isFetching), []);

  return (
    <div className="relative">
      <CardMemo>
        <div className="flex flex-col gap-y-5">
          <div className="flex items-center gap-x-4 pt-6 px-7.5">
            <BackButtonMemo
              path={'/Customer'}
              label={'Daftar Customer'}
            />
            <DividerMemo
              direction={'VERTICAL'}
            />
            <span className="font-semibold text-title-xsm">Tambah Customer</span>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <AddEditCustomerForm
            handleIsFetching={handleIsFetching}
          />
        </div>
      </CardMemo>
      {isFetching ? <Spinner /> : null}
    </div>
  );
};

export default AddCustomer;
