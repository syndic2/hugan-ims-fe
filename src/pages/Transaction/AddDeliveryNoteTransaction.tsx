import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { FaCartPlus, FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Swal from 'sweetalert2';

import { SWAL_CONFIG } from '../../constants';
import { BaseSelect } from '../../commons/common';

import { TRANSACTION_TYPE, TransactionWarehouseSelect } from '../../data/transaction/constants';
import { TransactionProps, Transaction, InitialDeliveryNoteTransaction } from '../../data/transaction/domain';
import {
  DTransaction,
  InitialDeliveryNoteDtransaction,
  InitialCombinedDeliveryNoteDtransaction
} from '../../data/dtransaction/domain';
import {
  TransactionItemErrors,
  CombinedTransactionItemErrors,
  AddDeliveryNoteTransactionErrors
} from '../../data/transaction/errors';
import { TransactionMapper } from '../../data/transaction/mapper';
import { TransactionService } from '../../data/transaction/service';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import { InputLabelErrorMemo } from '../../components/InputLabelError/InputLabelError';
import { InputMemo } from '../../components/Input/Input';
import { DatePickerMemo } from '../../components/DatePicker/DatePicker';
import { SelectMemo } from '../../components/Select/Select';
import { ButtonMemo } from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';

import { TransactionItemMemo } from './components/TransactionItem';
import { CombinedTransactionItemMemo } from './components/CombinedTransactionItem';

export interface DeliveryNoteDataProps {
  delivery_note_id?: string;
  transaction?: TransactionProps;
}

const AddDeliveryNoteTransaction = () => {
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>(Transaction.create(InitialDeliveryNoteTransaction));
  const [transactionErrors, setTransactionErrors] = useState<AddDeliveryNoteTransactionErrors>();
  const [dtransactionsErrors, setDtransactionsErrors] = useState<TransactionItemErrors[]>([]);
  const [combinedDtransactionsErrors, setCombinedDtransactionsErrors] = useState<CombinedTransactionItemErrors[]>([]);
  const [transactionsSelect, setTransactionsSelect] = useState<BaseSelect<string>[]>([]);

  const fetchTransactionsSelect = async () => {
    try {
      setIsFetching(true);

      const { status, data } = await TransactionService.getTransactionsSelect({
        warehouse_id: transaction.warehouseSelect?.value,
        start_date: moment(transaction.startDate).startOf('month').format('Y-MM-DD'),
        end_date: moment(transaction.endDate).endOf('month').format('Y-MM-DD')
      });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setTransactionsSelect((data.result || []).map(item => TransactionMapper.mapGetTransactionsSelectItemResToDomain(item)));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  const onTransactionWarehouseSelectChange = useCallback((item?: SingleValue<BaseSelect<string>>) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      warehouse_select: {
        label: item?.label || '',
        value: item?.value || ''
      }
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      warehouse_id: undefined
    }));
  }, []);

  const onChangeDates = useCallback((name: string, dates: Date[]) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      [name]: moment(dates[0]).format('Y-MM-DD')
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      [name]: undefined
    }));
  }, []);

  const fetchTransaction = useCallback(async (transactionId: string) => {
    try {
      setIsFetching(true);

      const { status, data } = await TransactionService.getTransaction({ transaction_id: transactionId });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setTransaction(prevState => Transaction.create({
        ...prevState.props,
        ...TransactionMapper.mapGetTransactionResToDomain(data).props
      }));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  }, []);

  const onTransactionSelectChange = useCallback((item?: SingleValue<BaseSelect<string>>) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      transaction_select: {
        label: item?.label || '',
        value: item?.value || ''
      }
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      transaction_id: undefined
    }));

    item?.value && fetchTransaction(item?.value);
  }, []);

  useEffect(() => {
    if (transaction.warehouseSelect &&
      transaction.warehouseSelect.value &&
      transaction.startDate && transaction.endDate
    ) {
      fetchTransactionsSelect();
      setTransaction(prevState => Transaction.create({
        ...prevState.props,
        transaction_select: null
      }));
    }
  }, [transaction.warehouseSelect, transaction.startDate, transaction.endDate]);

  const onAddDetailTransactionClick = useCallback(() => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: [...(prevState.dtransactions || []), DTransaction.create({
        ...InitialDeliveryNoteDtransaction,
        object_id: uuidv4()
      })]
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      items: undefined
    }));
  }, []);

  const onAddCombinedDetailTransactionClick = useCallback(() => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: [...(prevState.dtransactions || []), DTransaction.create({
        ...InitialCombinedDeliveryNoteDtransaction,
        object_id: uuidv4()
      })]
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      items: undefined
    }));
  }, []);

  const onDeleteDetailTransactionClick = useCallback((objectId: string) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: (prevState.dtransactions || []).filter(item => item.objectId !== objectId)
    }));
    setDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
    setCombinedDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
  }, []);

  const onChangeDetailTransaction = useCallback((objectId: string, propName: string, newValue: DTransaction) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: (prevState.dtransactions || []).map(item => {
        if (item.objectId !== objectId) return item;
        return DTransaction.create({ ...newValue.props });
      })
    }));

    let dtransactionsError = dtransactionsErrors.find(item => item.object_id === objectId);
    if (dtransactionsError) {
      dtransactionsError = {
        ...dtransactionsError,
        [propName]: undefined
      };

      const isAnyErrors = Object.entries(dtransactionsError).some(([key, value]) => key !== 'object_id' && value);
      if (isAnyErrors) {
        setDtransactionsErrors(prevState => prevState.map(item => {
          if (item.object_id !== objectId) return item;
          return {
            ...item,
            ...dtransactionsError
          };
        }));
      } else {
        setDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
      }
    }

    let combinedDtransactionsError = combinedDtransactionsErrors.find(item => item.object_id === objectId);
    if (combinedDtransactionsError) {
      combinedDtransactionsError = {
        ...combinedDtransactionsError,
        [propName]: undefined
      };

      const isAnyErrors = Object.entries(combinedDtransactionsError).some(([key, value]) => key !== 'object_id' && value);
      if (isAnyErrors) {
        setCombinedDtransactionsErrors(prevState => prevState.map(item => {
          if (item.object_id !== objectId) return item;
          return {
            ...item,
            ...combinedDtransactionsError
          };
        }));
      } else {
        setCombinedDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
      }
    }
  }, [dtransactionsErrors, combinedDtransactionsErrors]);

  const validateAddDeliveryNote = () => {
    let isValid = true;

    if (!transaction.warehouseSelect || !transaction.warehouseSelect.value) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
      setTransactionErrors(prevState => ({
        ...prevState,
        warehouse_id: 'Gudang wajib diisi.'
      }));
    }
    if (!transaction.startDate) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
      setTransactionErrors(prevState => ({
        ...prevState,
        start_date: 'Tanggal awal wajib diisi.'
      }));
    }
    if (!transaction.endDate) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
      setTransactionErrors(prevState => ({
        ...prevState,
        end_date: 'Tanggal akhir wajib diisi.'
      }));
    }
    if (!transaction.transactionSelect || !transaction.transactionSelect.value) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
      setTransactionErrors(prevState => ({
        ...prevState,
        transaction_id: 'No. Faktur wajib diisi.'
      }));
    }
    if (!transaction.dtransactions || transaction.dtransactions.length === 0) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
      setTransactionErrors(prevState => ({
        ...prevState,
        items: 'Belum terdapat data barang yang ditambahkan.'
      }));
    }

    let dtransactionsErrorCount = 0;
    (transaction.dtransactions || []).forEach(item => {
      if (item.isCombined) {
        const newCombinedDtransactionError: CombinedTransactionItemErrors = {};

        if (!item.remark || item.remark === '') {
          newCombinedDtransactionError.remark = 'Nama barang wajib diisi';
          dtransactionsErrorCount++;
        }

        if (Object.keys(newCombinedDtransactionError).length > 0) {
          const combinedDtransactionsError = combinedDtransactionsErrors.find(item1 => item1.object_id === item.objectId);
          if (combinedDtransactionsError) {
            setCombinedDtransactionsErrors(prevState => prevState.map(item1 => {
              if (item1.object_id !== item.objectId) return item1;
              return {
                ...item1,
                remark: newCombinedDtransactionError.remark
              };
            }));
          } else {
            setCombinedDtransactionsErrors(prevState => [...prevState, {
              object_id: item.objectId,
              remark: newCombinedDtransactionError.remark
            }]);
          }
        }
      } else {
        const newDtransactionError: TransactionItemErrors = {};

        if (!item.productSelect || item.productSelect.value === '') {
          newDtransactionError.product_code = 'Barang wajib diisi';
          dtransactionsErrorCount++;
        }

        if (Object.keys(newDtransactionError).length > 0) {
          const dtransactionError = dtransactionsErrors.find(item1 => item1.object_id === item.objectId);
          if (dtransactionError) {
            setDtransactionsErrors(prevState => prevState.map(item1 => {
              if (item1.object_id !== item.objectId) return item1;
              return {
                ...item1,
                product_code: newDtransactionError.product_code
              };
            }));
          } else {
            setDtransactionsErrors(prevState => [...prevState, {
              object_id: item.objectId,
              product_code: newDtransactionError.product_code
            }]);
          }
        }
      }
    });

    if (dtransactionsErrorCount > 0) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
    }

    return isValid;
  }

  const onSaveClick = useCallback(async () => {
    const validateAddDeliveryNoteResult = validateAddDeliveryNote();
    if (!validateAddDeliveryNoteResult) return;

    try {
      setIsFetching(true);

      const { status, data, message } = await TransactionService.getDeliveryNoteTransaction({
        warehouse_id: transaction.warehouseSelect?.value
      });
      if (!status) {
        Swal.fire({
          ...SWAL_CONFIG,
          icon: 'error',
          title: 'Oops...',
          text: message
        });

        return;
      }

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'success',
        title: 'Surat Jalan',
        text: message
      });

      localStorage.setItem('delivery_note', JSON.stringify({
        delivery_note_id: data,
        transaction: { ...transaction.props }
      }));
      window.open(`/transaction/delivery-note/print`, '_blank', 'noreferrer');

      setTransaction(Transaction.create(InitialDeliveryNoteTransaction));
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  }, [transaction, transactionErrors, dtransactionsErrors]);

  const onCancelClick = useCallback(() => {
    navigate('/transaction');
  }, []);

  return (
    <div className="relative">
      <CardMemo>
        <div className="flex flex-col gap-y-5">
          <div className="flex items-center gap-x-4 pt-6 px-7.5">
            <BackButtonMemo
              path={'/transaction'}
              label={'Daftar Transaksi'}
            />
            <DividerMemo direction={'VERTICAL'} />
            <span className="font-semibold text-title-xsm">Tambah Surat Jalan</span>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-8 pb-6">
            <div className="grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-6 2xl:gap-8">
              <InputMemo
                label={'Tanggal Surat Jalan'}
                type={'text'}
                isDisabled
                value={moment().format('DD-MMMM-YYYY')}
              />
              <SelectMemo
                key={'add-delivery-note-transaction-warehouse-select'}
                label={'Gudang'}
                isRequired
                styles={{
                  container: base => ({
                    ...base,
                    height: '100%'
                  }),
                  control: base => ({
                    ...base,
                    width: '100%',
                    height: '100%'
                  })
                }}
                options={TransactionWarehouseSelect}
                isSearchable
                placeholder={'Pilih gudang'}
                value={transaction.warehouseSelect}
                onChange={onTransactionWarehouseSelectChange}
                error={transactionErrors?.warehouse_id}
              />
              <DatePickerMemo
                name={'start_date'}
                label={'Tanggal Awal'}
                isRequired
                handleChange={onChangeDates}
                error={transactionErrors?.start_date}
              />
              <DatePickerMemo
                name={'end_date'}
                label={'Tanggal Akhir'}
                isRequired
                handleChange={onChangeDates}
                error={transactionErrors?.end_date}
              />
              <SelectMemo
                key={'add-delivery-note-transaction-select'}
                label={'No. Faktur Penjualan'}
                isRequired
                styles={{
                  container: base => ({
                    ...base,
                    height: '100%'
                  }),
                  control: base => ({
                    ...base,
                    width: '100%',
                    height: '100%'
                  })
                }}
                options={transactionsSelect}
                isSearchable
                isLoading={isFetching}
                placeholder={'Pilih faktur penjualan'}
                noOptionsMessage={() => 'Data transaksi tidak ada.'}
                value={transaction.transactionSelect}
                onChange={onTransactionSelectChange}
                error={transactionErrors?.transaction_id}
              />
            </div>
            <div className="flex flex-col md:flex-row justify-end items-center gap-5 mt-5">
              <ButtonMemo
                label={'Barang Gabungan'}
                icon={<FaCartPlus size={20} />}
                classNames={'bg-yellow-500 w-full h-fit md:!w-fit'}
                handleClick={onAddCombinedDetailTransactionClick}
              />
              <ButtonMemo
                label={'Barang'}
                icon={<FaCartPlus size={20} />}
                classNames={'bg-blue-500 w-full h-fit md:!w-28'}
                handleClick={onAddDetailTransactionClick}
              />
            </div>
            <div className="
              flex flex-col
              md:grid
              grid-cols-2
              xl:grid-cols-3
              2xl:grid-cols-4
              gap-8
              rounded border-[1.5px] border-stroke
              dark:border-form-strokedark
              h-115
              overflow-y-auto
              mt-7
              p-6
            ">
              {(transaction.dtransactions || []).map((item, idx) => item.isCombined ? (
                <CombinedTransactionItemMemo
                  key={`add-delivery-note-combined-transaction-item-${idx}`}
                  index={idx}
                  objectId={item.objectId || ''}
                  type={TRANSACTION_TYPE.DELIVERY_NOTE}
                  dtransaction={item}
                  handleChangeCombinedItem={onChangeDetailTransaction}
                  handleDeleteCombinedItem={onDeleteDetailTransactionClick}
                  errors={combinedDtransactionsErrors.find(item1 => item1.object_id === item.objectId)}
                />
              ) : (
                <TransactionItemMemo
                  key={`add-delivery-note-transaction-item-${idx}`}
                  index={idx}
                  objectId={item.objectId || ''}
                  type={TRANSACTION_TYPE.SPLIT}
                  dtransaction={item}
                  handleChangeItem={onChangeDetailTransaction}
                  handleDeleteItem={onDeleteDetailTransactionClick}
                  errors={dtransactionsErrors.find(item1 => item1.object_id === item.objectId)}
                />
              ))}
            </div>
            {transactionErrors?.items ? (
              <InputLabelErrorMemo
                error={transactionErrors.items}
              />
            ) : null}
            <div className="flex flex-col-reverse md:flex-row md:justify-end items-center gap-4 mt-7">
              <ButtonMemo
                label={'Batalkan'}
                icon={<MdCancel size={20} />}
                classNames={'bg-red-500 w-full md:!w-fit'}
                handleClick={onCancelClick}
              />
              <ButtonMemo
                label={'Simpan'}
                icon={<FaSave size={20} />}
                classNames={'w-full md:!w-fit'}
                handleClick={onSaveClick}
              />
            </div>
          </div>
        </div>
      </CardMemo>
      {isFetching ? (
        <Spinner />
      ) : null}
    </div>
  );
};

export default AddDeliveryNoteTransaction;
