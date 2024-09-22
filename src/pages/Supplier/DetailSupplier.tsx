import { useState, useCallback, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaCirclePlus } from 'react-icons/fa6';
import { useMediaQuery } from 'react-responsive';

import { SupplierTransactionTableHeaderLabels } from '../../data/supplier/constants';
import { Supplier } from '../../data/supplier/domain';
import { SupplierMapper } from '../../data/supplier/mapper';
import { SupplierService } from '../../data/supplier/service';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import { TableMemo } from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';

import { AddEditSupplierFormMemo } from './components/AddEditSupplierForm';
import DetailSupplierTransactionTableRow from './components/DetailSupplierTransactionTableRow';

const DetailSupplier: React.FC = () => {
  const { id } = useParams<{ id: string; }>();
  const navigate = useNavigate();
  const isSm = useMediaQuery({ query: '(min-width: 640px)' });

  const [existSupplier, setExistSupplier] = useState<Supplier>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchSupplier = async (id: number) => {
    try {
      setIsFetching(true);

      const { status, data } = await SupplierService.getSupplier({ id });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setExistSupplier(SupplierMapper.mapGetSupplierResToDomain(data));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (id) fetchSupplier(parseInt(id));
  }, [id]);

  const handleIsFetcing = useCallback((isFetching: boolean) => setIsFetching(isFetching), []);

  const refetchSupplier = useCallback(async () => {
    if (id) fetchSupplier(parseInt(id));
  }, [fetchSupplier]);

  return (
    <>
      <div className="relative">
        <CardMemo>
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center pt-6 px-7.5">
              <div className="flex items-center gap-x-4">
                <BackButtonMemo path={'/supplier'} label={'Daftar Supplier'} />
                <DividerMemo direction={'VERTICAL'} />
                <span className="font-semibold text-title-xsm">
                  Detail Supplier
                </span>
              </div>
              <NavLink to={'/supplier/add'} className="flex items-center gap-x-2 hover:underline cursor-pointer">
                <FaCirclePlus size={isSm ? 20 : 28} />
                {isSm ? <span className="font-semibold text-title-xsm">Tambah Supplier</span> : null}
              </NavLink>
            </div>
            <DividerMemo
              direction={'HORIZONTAL'}
              classNames={'border-stroke'}
            />
            <AddEditSupplierFormMemo
              id={id}
              existSupplier={existSupplier}
              handleIsFetching={handleIsFetcing}
              refetchSupplier={refetchSupplier}
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
              name={'detail-supplier-transaction-table'}
              hasPagination={false}
              headerLabels={SupplierTransactionTableHeaderLabels}
              rowData={existSupplier?.transactions || []}
              RowElement={DetailSupplierTransactionTableRow}
            />
          </div>
        </div>
      </CardMemo>
    </>
  );
};

export default DetailSupplier;
