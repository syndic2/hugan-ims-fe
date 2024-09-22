import { useState, useMemo, useEffect, useCallback } from 'react';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { FaCirclePlus, FaPrint } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";

import { numericFormat } from '../../commons/helpers';

import { DtransactionTableHeaderLabels } from '../../data/transaction/constants';
import { TRANSACTION_TYPE } from '../../data/transaction/constants';
import { Transaction } from '../../data/transaction/domain';
import { TransactionMapper } from '../../data/transaction/mapper';
import { TransactionService } from '../../data/transaction/service';

import { DTransaction } from '../../data/dtransaction/domain';

import { CardMemo } from '../../components/Card/Card';
import { ModalMemo } from '../../components/Modal/Modal';
import { DividerMemo } from '../../components/Divider/Divider';
import { ButtonMemo } from '../../components/Button/Button';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DetailFieldMemo } from '../../components/DetailField/DetailField';
import { TableMemo } from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';

import DetailTransactionItemTableRow, { DetailTransactionItemTableRowExtraProps } from './components/DetailTransactionItemTableRow';
import DetailCombinedTransactionItemModal from './components/DetailCombinedTransactionItemModal';

const DetailTransaction = () => {
  const { transaction_id } = useParams<{ transaction_id: string }>();
  const navigate = useNavigate();

  const isSm = useMediaQuery({ query: '(min-width: 640px)' });

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>();
  const [isOpenCombinedItemModal, setIsOpenCombinedItemModal] = useState<boolean>(false);
  const [selectedDtransaction, setSelectedDtransaction] = useState<DTransaction>();

  const fetchTransaction = async (transactionId: string) => {
    try {
      setIsFetching(true);

      const { status, data } = await TransactionService.getTransaction({ transaction_id: transactionId });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setTransaction(TransactionMapper.mapGetTransactionResToDomain(data));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (transaction_id) fetchTransaction(transaction_id);
  }, [transaction_id]);

  const transactionTypeLabel = transaction?.transactionType === TRANSACTION_TYPE.PURCHASE ? 'Pembelian' : 'Penjualan';

  const onOpenCombinedItemModal = useCallback((item: DTransaction) => {
    setSelectedDtransaction(item);
    setIsOpenCombinedItemModal(true);
  }, []);

  const onCloseCombinedItemModal = useCallback(() => {
    setIsOpenCombinedItemModal(false);
  }, []);

  const DetailTransactionItemExtraProps = useMemo((): DetailTransactionItemTableRowExtraProps => ({
    handleOpenCombinedItemModal: onOpenCombinedItemModal
  }), [onOpenCombinedItemModal]);

  const onClickPrintInvoiceSale = useCallback(() => {
    window.open(`/transaction/sale-invoice/print/${transaction_id}`, '_blank', 'noreferrer');
  }, []);

  return (
    <div className="relative">
      <CardMemo>
        <div className="flex flex-col gap-y-5">
          <div className="flex justify-between items-center pt-6 px-7.5">
            <div className="flex items-center gap-x-4">
              <BackButtonMemo
                path={'/transaction'}
                label={'Daftar Transaksi'}
              />
              <DividerMemo direction={'VERTICAL'} />
              <span className="font-semibold text-title-xsm">
                Detail {transactionTypeLabel} [{transaction?.notaId}]
              </span>
            </div>
            <NavLink
              to={`/transaction/add/${transaction?.transactionType === TRANSACTION_TYPE.PURCHASE ? 'purchase' : 'sale'}`}
              className="flex items-center gap-x-2 hover:underline cursor-pointer"
            >
              <FaCirclePlus size={isSm ? 20 : 28} />
              {isSm ? (
                <span className="font-semibold text-title-xsm">
                  Tambah {transactionTypeLabel}
                </span>
              ) : null}
            </NavLink>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="flex flex-col md:grid grid-cols-2 lg:grid-cols-3 gap-8 px-7.5 pb-6">
            <DetailFieldMemo
              label={'No. Nota'}
              value={transaction?.notaId || '-'}
            />
            <DetailFieldMemo
              label={'Tanggal & Waktu'}
              value={transaction?.createdAt || '-'}
            />
            <DetailFieldMemo
              label={'Tipe Transaksi'}
              value={transactionTypeLabel || '-'}
            />
            <DetailFieldMemo
              label={'Gudang'}
              value={transaction?.warehouseId || '-'}
            />
            {transaction?.transactionType === TRANSACTION_TYPE.PURCHASE ? (
              <>
                <DetailFieldMemo
                  label={'Nama Supplier'}
                  value={transaction.supplier?.supplierName || '-'}
                />
                <DetailFieldMemo
                  label={'Alamat Supplier'}
                  value={transaction.supplier?.address || '-'}
                />
                <DetailFieldMemo
                  label={'No. Telp Supplier'}
                  value={transaction.supplier?.phoneNumber || '-'}
                />
                <DetailFieldMemo
                  label={'Status Supplier'}
                  value={transaction.supplier?.getActiveLabel() || '-'}
                />
              </>
            ) : null}
            {transaction?.transactionType === TRANSACTION_TYPE.SALE ? (
              <>
                <DetailFieldMemo
                  label={'Nama Customer'}
                  value={transaction.customer?.customerName || '-'}
                />
                <DetailFieldMemo
                  label={'Alamat Customer'}
                  value={transaction.customer?.address || '-'}
                />
                <DetailFieldMemo
                  label={'No. Telp Customer'}
                  value={transaction.customer?.phoneNumber || '-'}
                />
                <DetailFieldMemo
                  label={'Status Customer'}
                  value={transaction.customer?.getActiveLabel() || '-'}
                />
              </>
            ) : null}
          </div>
        </div>
      </CardMemo>
      <CardMemo containerClassNames={'mt-5'}>
        <div className='flex flex-col gap-y-5 py-6'>
          <span className="font-semibold text-title-xsm px-7.5">
            Daftar {transactionTypeLabel} Barang
          </span>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-7.5">
            <TableMemo
              name={'detail-transaction-dtransaction-table'}
              hasPagination={false}
              headerLabels={DtransactionTableHeaderLabels(transaction?.transactionType || '')}
              rowData={transaction?.dtransactions || []}
              rowElementExtraProps={DetailTransactionItemExtraProps}
              RowElement={DetailTransactionItemTableRow}
            />
          </div>
        </div>
      </CardMemo>
      <CardMemo containerClassNames={'mt-5'}>
        <div className='flex flex-col gap-y-5 py-6'>
          <span className="font-semibold text-title-xsm px-7.5">
            Detail Penjualan
          </span>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="grid grid-cols-2 gap-2 px-7.5">
            <span>Total Jenis Barang</span>
            <div className="font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.items || 0)}</div>

            <span className="font-semibold">Subtotal</span>
            <div className="font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.subTotal || 0)}</div>

            <span className="text-red-500">Diskon</span>
            <div className="text-red-500 font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.discount || 0)} (-)</div>

            <span className="font-semibold">Subtotal (Setelah Diskon)</span>
            <div className="font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.totalWoTax || 0)}</div>

            <span>PPN</span>
            <div className="text-green-500 font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.ppn || 0)} (+)</div>

            <span className="font-semibold">Grand Total</span>
            <div className="font-semibold ml-auto md:mr-auto md:ml-0">{numericFormat(transaction?.total || 0)}</div>
          </div>
          {transaction?.transactionType === TRANSACTION_TYPE.SALE ? (
            <>
              <DividerMemo
                direction={'HORIZONTAL'}
                classNames={'border-stroke'}
              />
              <div className="flex gap-5 items-center ml-auto px-7.5">
                <ButtonMemo
                  label={'Print Faktur'}
                  icon={<FaPrint size={20} />}
                  classNames={'w-full md:!w-fit bg-blue-400'}
                  handleClick={onClickPrintInvoiceSale}
                />
              </div>
            </>
          ) : null}
        </div>
      </CardMemo>
      <ModalMemo isOpen={isOpenCombinedItemModal}>
        <DetailCombinedTransactionItemModal
          item={selectedDtransaction}
          handleCloseModal={onCloseCombinedItemModal}
        />
      </ModalMemo>
      {isFetching ? (
        <Spinner />
      ) : null}
    </div>
  );
};

export default DetailTransaction;
