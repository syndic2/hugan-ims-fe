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

import { CustomerMapper } from '../../data/customer/mapper';
import { CustomerService } from '../../data/customer/service';

import { TRANSACTION_TYPE, TransactionWarehouseSelect } from '../../data/transaction/constants';
import { Transaction, InitialSaleTransaction } from '../../data/transaction/domain';
import { DTransaction, InitialDtransaction, InitialCombinedDtransaction } from '../../data/dtransaction/domain';
import { TransactionItemErrors, CombinedTransactionItemErrors, AddSaleTransactionErrors } from '../../data/transaction/errors';
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
import { CombinedTransactionItemMemo } from './components/CombinedTransactionItem';

const AddSaleTransaction = () => {
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>(Transaction.create(InitialSaleTransaction));
  const [transactionErrors, setTransactionErrors] = useState<AddSaleTransactionErrors>();
  const [dtransactionsErrors, setDtransactionsErrors] = useState<TransactionItemErrors[]>([]);
  const [combinedDtransactionsErrors, setCombinedDtransactionsErrors] = useState<CombinedTransactionItemErrors[]>([]);
  const [customersSelect, setCustomersSelect] = useState<BaseSelect<number>[]>([]);

  const fetchCustomersSelect = async () => {
    try {
      setIsFetching(true);

      const { status, data } = await CustomerService.getCustomersSelect();
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setCustomersSelect((data.result || []).map(item => CustomerMapper.mapGetCustomersSelectItemResToDomain(item)));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  const onCustomerSelectOpen = useCallback(() => {
    if (customersSelect.length === 0) fetchCustomersSelect();
  }, [customersSelect]);

  const onCustomerSelectChange = useCallback((item?: SingleValue<BaseSelect<number>>) => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      customer_select: {
        label: item?.label || '',
        value: item?.value || 0
      }
    }));
    setTransactionErrors(prevState => ({
      ...prevState,
      customer_id: undefined
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

  const onAddDetailTransactionClick = useCallback(() => {
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

  const onAddCombinedDetailTransactionClick = useCallback(() => {
    setTransaction(prevState => Transaction.create({
      ...prevState.props,
      dtransactions: [...(prevState.dtransactions || []), DTransaction.create({
        ...InitialCombinedDtransaction,
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

  const validateAddTransaction = () => {
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
    if (!transaction.customerSelect || !transaction.customerSelect.value) {
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
        customer_id: 'Customer wajib diisi.'
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
        if (!item.items || item.items.length === 0) {
          newCombinedDtransactionError.items = 'Barang gabungan wajib diisi';
          dtransactionsErrorCount++;
        }

        if (Object.keys(newCombinedDtransactionError).length > 0) {
          const combinedDtransactionsError = combinedDtransactionsErrors.find(item1 => item1.object_id === item.objectId);
          if (combinedDtransactionsError) {
            setCombinedDtransactionsErrors(prevState => prevState.map(item1 => {
              if (item1.object_id !== item.objectId) return item1;
              return {
                ...item1,
                remark: newCombinedDtransactionError.remark,
                items: newCombinedDtransactionError.items
              };
            }));
          } else {
            setCombinedDtransactionsErrors(prevState => [...prevState, {
              object_id: item.objectId,
              remark: newCombinedDtransactionError.remark,
              items: newCombinedDtransactionError.items
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
  };

  const onSaveClick = useCallback(async () => {
    const validateAddTransactionResult = validateAddTransaction();
    if (!validateAddTransactionResult) return;

    try {
      setIsFetching(true);

      const { status, message } = await TransactionService.addSaleTransaction(TransactionMapper.mapDomainToAddSaleTransactionBody(transaction));
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
        title: 'Transaksi Penjualan',
        text: message
      });
      setTransaction(Transaction.create(InitialSaleTransaction));
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
            <span className="font-semibold text-title-xsm">Tambah Transaksi Penjualan</span>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-8 pb-6">
            <div className="grid grid-flow-row md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 2xl:gap-8">
              <InputMemo
                label={'Tanggal Penjualan'}
                type={'text'}
                isDisabled
                value={moment().format('DD-MMMM-YYYY')}
              />
              <SelectMemo
                key={'add-sale-transaction-warehouse-select'}
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
              <SelectMemo
                key={'add-sale-transaction-customer-select'}
                label={'Customer'}
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
                options={customersSelect}
                isSearchable
                isLoading={isFetching}
                placeholder={'Pilih customer'}
                noOptionsMessage={() => 'Data customer tidak ada.'}
                value={transaction.customerSelect}
                onMenuOpen={onCustomerSelectOpen}
                onChange={onCustomerSelectChange}
                error={transactionErrors?.customer_id}
              />
              <InputNumberMemo
                label={'Diskon'}
                name={'discount'}
                min={0}
                value={transaction.discount || 0}
                handleChange={onInputChange}
              />
              <InputNumberMemo
                label={'PPN (%)'}
                name={'ppn'}
                min={0}
                max={100}
                value={transaction.ppn || 0}
                handleChange={onInputChange}
              />
              <div className="flex flex-col w-full md:flex-row gap-5 ml-auto mt-auto md:col-span-2 lg:col-span-3 xl:col-span-4 2xl:col-span-5 md:w-fit">
                <ButtonMemo
                  label={'Barang Gabungan'}
                  icon={<FaCartPlus size={20} />}
                  classNames={'bg-yellow-500 w-full h-fit md:!w-fit'}
                  handleClick={onAddCombinedDetailTransactionClick}
                />
                <ButtonMemo
                  label={'Barang Reguler'}
                  icon={<FaCartPlus size={20} />}
                  classNames={'bg-blue-500 w-full h-fit md:!w-fit'}
                  handleClick={onAddDetailTransactionClick}
                />
              </div>
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
                  key={`add-sale-combined-transaction-item-${idx}`}
                  index={idx}
                  objectId={item.objectId || ''}
                  dtransaction={item}
                  handleChangeCombinedItem={onChangeDetailTransaction}
                  handleDeleteCombinedItem={onDeleteDetailTransactionClick}
                  errors={combinedDtransactionsErrors.find(item1 => item1.object_id === item.objectId)}
                />
              ) : (
                <TransactionItemMemo
                  key={`add-sale-transaction-item-${idx}`}
                  index={idx}
                  objectId={item.objectId || ''}
                  type={TRANSACTION_TYPE.SALE}
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

export default AddSaleTransaction;
