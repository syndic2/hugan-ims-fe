import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { FaCartPlus, FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';
import Swal from 'sweetalert2';

import { SWAL_CONFIG } from '../../constants';
import { BaseSelect } from '../../commons/common';

import { SupplierMapper } from '../../data/supplier/mapper';
import { SupplierService } from '../../data/supplier/service';

import { TRANSACTION_TYPE, TransactionWarehouseSelect } from '../../data/transaction/constants';
import { Transaction, InitialPurchaseTransaction } from '../../data/transaction/domain';
import { DTransaction, InitialDtransaction } from '../../data/dtransaction/domain';
import { TransactionItemErrors, AddPurchaseTransactionErrors } from '../../data/transaction/errors';
import { TransactionMapper } from '../../data/transaction/mapper';
import { TransactionService } from '../../data/transaction/service';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import { InputLabelErrorMemo } from '../../components/InputLabelError/InputLabelError';
import { InputMemo } from '../../components/Input/Input';
import { InputNumberMemo } from '../../components/InputNumber/InputNumber';
import { SelectMemo } from '../../components/Select/Select';
import { ButtonMemo } from '../../components/Button/Button';
import Spinner from '../../components/Spinner/Spinner';

import { TransactionItemMemo } from './components/TransactionItem';

const AddPurchaseTransaction = () => {
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>(Transaction.create(InitialPurchaseTransaction));
  const [transactionErrors, setTransactionErrors] = useState<AddPurchaseTransactionErrors>();
  const [dtransactionsErrors, setDtransactionsErrors] = useState<TransactionItemErrors[]>([]);
  const [suppliersSelect, setSuppliersSelect] = useState<BaseSelect<number>[]>([]);

  const fetchSuppliersSelect = async () => {
    try {
      setIsFetching(true);

      const { status, data } = await SupplierService.getSuppliersSelect();
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setSuppliersSelect((data.result || []).map(item => SupplierMapper.mapGetSuppliersSelectItemResToDomain(item)));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  const onSupplierSelectOpen = useCallback(() => {
    if (suppliersSelect.length === 0) fetchSuppliersSelect();
  }, [suppliersSelect]);

  const onSupplierSelectChange = useCallback((item?: SingleValue<BaseSelect<number>>) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      supplier_select: {
        label: item?.label || '',
        value: item?.value || 0
      }
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      supplier_id: undefined
    }));
  }, []);

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

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      [event.target.name]: event.target.value
    }));
  }, []);

  const onAddTransactionItemClick = useCallback(() => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: [...(prevState.dtransactions || []), DTransaction.create({
        ...InitialDtransaction,
        object_id: uuidv4()
      })]
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      items: undefined
    }));
  }, []);

  const onDeleteTransactionItemClick = useCallback((objectId: string) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: (prevState.dtransactions || []).filter(item => item.objectId !== objectId)
    }));
    setDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
  }, []);

  const onChangeTransactionItem = useCallback((objectId: string, propName: string, newValue: DTransaction) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: (prevState.dtransactions || []).map(item => {
        if (item.objectId !== objectId) return item;
        return DTransaction.create({ ...newValue.props });
      })
    }));

    let dtransactionErrors = dtransactionsErrors.find(item => item.object_id === objectId);
    if (dtransactionErrors) {
      dtransactionErrors = {
        ...dtransactionErrors,
        [propName]: undefined
      };

      const isAnyErrors = Object.entries(dtransactionErrors).some(([key, value]) => key !== 'object_id' && value);
      if (isAnyErrors) {
        setDtransactionsErrors(prevState => prevState.map(item => {
          if (item.object_id !== objectId) return item;
          return {
            ...item,
            ...dtransactionErrors
          };
        }));
      } else {
        setDtransactionsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
      }
    }
  }, [dtransactionsErrors]);

  const validateAddTransaction = () => {
    let isValid = true;

    if (!transaction.transactionId || transaction.transactionId === '') {
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
        transaction_id: 'No. Nota wajib diisi.'
      }));
    }
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
    if (!transaction.supplierSelect || !transaction.supplierSelect.value) {
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
        supplier_id: 'Supplier wajib diisi.'
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

    let dtransactionsErrorsCount = 0;
    (transaction.dtransactions || []).forEach(item => {
      const newDtransactionError: TransactionItemErrors = {};

      if (!item.productSelect || item.productSelect.value === '') {
        newDtransactionError.product_code = 'Barang wajib diisi';
        dtransactionsErrorsCount++;
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
    });
    if (dtransactionsErrorsCount > 0) {
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
  };

  const onSaveClick = useCallback(async () => {
    const validateAddTransactionResult = validateAddTransaction();
    if (!validateAddTransactionResult) return;

    try {
      setIsFetching(true);

      const { status, message } = await TransactionService.addPurchaseTransaction(TransactionMapper.mapDomainToAddPurchaseTransactionBody(transaction));
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
        title: 'Transaksi Pembelian',
        text: message
      });
      setTransaction(Transaction.create(InitialPurchaseTransaction));
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
            <span className="font-semibold text-title-xsm">Tambah Transaksi Pembelian</span>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-8 pb-6">
            <div className="grid grid-flow-row md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr] 2xl:!flex gap-6 2xl:gap-8">
              <InputMemo
                label={'Tanggal Pembelian'}
                containerClassNames={'w-full 2xl:!w-fit'}
                type={'text'}
                isDisabled
                value={moment().format('DD-MMMM-YYYY')}
              />
              <InputMemo
                name={'transaction_id'}
                label={'No. Nota'}
                containerClassNames={'w-full 2xl:w-70'}
                type={'text'}
                isRequired
                value={transaction.transactionId}
                handleChange={onInputChange}
                error={transactionErrors?.transaction_id}
              />
              <SelectMemo
                key={'add-purchase-transaction-warehouse-select'}
                label={'Gudang'}
                isRequired
                className={'flex-1 min-w-full lg:w-50'}
                styles={{
                  control: base => ({
                    ...base,
                    width: '100%',
                    height: '100%'
                  })
                }}
                options={TransactionWarehouseSelect}
                isSearchable
                placeholder={'Pilih gudang'}
                onChange={onTransactionWarehouseSelectChange}
                error={transactionErrors?.warehouse_id}
              />
              <SelectMemo
                key={'add-purchase-transaction-supplier-select'}
                label={'Supplier'}
                isRequired
                className={'min-w-full lg:w-75 h-full'}
                styles={{
                  control: base => ({
                    ...base,
                    width: '100%',
                    height: '100%'
                  })
                }}
                options={suppliersSelect}
                isSearchable
                isLoading={isFetching}
                placeholder={'Pilih supplier'}
                noOptionsMessage={() => 'Data supplier tidak ada.'}
                onMenuOpen={onSupplierSelectOpen}
                onChange={onSupplierSelectChange}
                error={transactionErrors?.supplier_id}
              />
              <InputNumberMemo
                label={'PPN (%)'}
                containerClassName={'w-full 2xl:w-fit'}
                name={'ppn'}
                min={0}
                max={100}
                value={transaction.ppn || 0}
                handleChange={onInputChange}
              />
              <ButtonMemo
                label={'Barang'}
                icon={<FaCartPlus size={20} />}
                classNames={'bg-blue-500 w-full h-fit md:!w-fit ml-auto mt-auto md:col-span-2 lg:col-span-4'}
                handleClick={onAddTransactionItemClick}
              />
            </div>
            <div className="
              flex flex-col
              md:grid
              grid-cols-2
              lg:grid-cols-3
              2xl:grid-cols-4
              gap-8
              rounded border-[1.5px] border-stroke
              dark:border-form-strokedark
              h-115
              overflow-y-auto
              mt-7
              p-6
            ">
              {(transaction.dtransactions || []).map((item, idx) => (
                <TransactionItemMemo
                  key={`add-purchase-transaction-item-${idx}`}
                  index={idx}
                  objectId={item.objectId || ''}
                  type={TRANSACTION_TYPE.PURCHASE}
                  dtransaction={item}
                  handleChangeItem={onChangeTransactionItem}
                  handleDeleteItem={onDeleteTransactionItemClick}
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

export default AddPurchaseTransaction;
