import { useState, useCallback, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaCirclePlus } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

import { CustomerTransactionTableHeaderLabels } from '../../data/customer/constants';
import { Customer } from '../../data/customer/domain';
import { CustomerMapper } from '../../data/customer/mapper';
import { CustomerService } from '../../data/customer/service';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import { TableMemo } from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';

import { AddEditCustomerFormMemo } from './components/AddEditCustomerForm';
import DetailCustomerTransactionTableRow from './components/DetailCustomerTransactionTableRow';

const DetailCustomer: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const isSm = useMediaQuery({ query: '(min-width: 640px)' });

  const [existCustomer, setExistCustomer] = useState<Customer>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchCustomer = async (id: number) => {
    try {
      setIsFetching(true);

      const { status, data } = await CustomerService.getCustomer({ id: id });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setExistCustomer(CustomerMapper.mapGetCustomerResToDomain(data));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchCustomer(parseInt(id));
  }, [id]);

  const handleIsFetcing = useCallback((isFetching: boolean) => setIsFetching(isFetching), []);

  const refetchCustomer = useCallback(async () => {
    if (id) fetchCustomer(parseInt(id));
  }, [id]);

  return (
    <>
      <div className="relative">
        <CardMemo>
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center pt-6 px-7.5">
              <div className="flex items-center gap-x-4">
                <BackButtonMemo
                  path={'/customer'}
                  label={'Daftar Customer'}
                />
                <DividerMemo direction={'VERTICAL'} />
                <span className="font-semibold text-title-xsm">Detail Customer</span>
              </div>
              <NavLink to={'/Customer/add'} className="flex items-center gap-x-2 hover:underline cursor-pointer">
                <FaCirclePlus size={isSm ? 20 : 28} />
                {isSm ? <span className="font-semibold text-title-xsm">Tambah Customer</span> : null}
              </NavLink>
            </div>
            <DividerMemo
              direction={'HORIZONTAL'}
              classNames={'border-stroke'}
            />
            <AddEditCustomerFormMemo
              id={id}
              existCustomer={existCustomer}
              handleIsFetching={handleIsFetcing}
              refetchCustomer={refetchCustomer}
            />
          </div>
        </CardMemo>
        {isFetching ? <Spinner /> : null}
      </div>
      <CardMemo containerClassNames={'mt-5'}>
        <div className='flex flex-col gap-y-5 py-6'>
          <span className="font-semibold text-title-xsm px-7.5">
            Daftar Transaksi
          </span>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-7.5">
            <TableMemo
              name={'detail-customer-transaction-table'}
              hasPagination={false}
              headerLabels={CustomerTransactionTableHeaderLabels}
              rowData={existCustomer?.transactions || []}
              RowElement={DetailCustomerTransactionTableRow}
            />
          </div>
        </div>
      </CardMemo>
    </>
  );
};

export default DetailCustomer;
