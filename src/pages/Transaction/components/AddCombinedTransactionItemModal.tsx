import { useState, useCallback } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaCartPlus, FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';

import { SWAL_CONFIG } from '../../../constants';

import { TRANSACTION_TYPE } from '../../../data/transaction/constants';
import { DTransaction, InitialDtransaction } from '../../../data/dtransaction/domain';
import { TransactionItemErrors, AddCombinedTransactionItemModalErrors } from '../../../data/transaction/errors';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import { InputLabelErrorMemo } from '../../../components/InputLabelError/InputLabelError';
import { InputMemo } from '../../../components/Input/Input';
import { ButtonMemo } from '../../../components/Button/Button';

import { TransactionItemMemo } from './TransactionItem';

interface AddCombinedTransactionItemModalProps {
  dtransaction: DTransaction;
  handleChangeItem?: (propName: keyof AddCombinedTransactionItemModalErrors, newItem: DTransaction) => void;
  handleCloseModal: () => void;
}

const AddCombinedTransactionItemModal: React.FC<AddCombinedTransactionItemModalProps> = (props: AddCombinedTransactionItemModalProps) => {
  const {
    dtransaction,
    handleChangeItem,
    handleCloseModal
  } = props;

  const [dtransactionItems, setDtransactionItems] = useState<DTransaction[]>(dtransaction.items || []);
  const [dtransactionErrors, setDtransactionErrors] = useState<AddCombinedTransactionItemModalErrors>();
  const [dtransactionItemsErrors, setDtransactionItemsErrors] = useState<TransactionItemErrors[]>([]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeItem && handleChangeItem(event.target.name as keyof AddCombinedTransactionItemModalErrors, DTransaction.create({
      ...dtransaction.props,
      [event.target.name]: event.target.value
    }));
    setDtransactionErrors(prevState => ({
      ...prevState,
      [event.target.name]: undefined
    }))
  }, [dtransaction, handleChangeItem]);

  const onAddTransactionItemClick = useCallback(() => {
    setDtransactionItems(prevState => [...prevState, DTransaction.create({
      ...InitialDtransaction,
      object_id: uuidv4()
    })]);
    setDtransactionErrors(prevState => ({
      ...prevState,
      items: undefined
    }))
  }, []);

  const onDeleteTransactionItemClick = useCallback((objectId: string) => {
    setDtransactionItems(prevState => prevState.filter(item => item.objectId !== objectId));
    setDtransactionItemsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
  }, []);

  const onChangeTransactionItem = useCallback((objectId: string, propName: string, newValue: DTransaction) => {
    setDtransactionItems(prevState => prevState.map(item => {
      if (item.objectId !== objectId) return item;
      return DTransaction.create({ ...newValue.props });
    }));

    let dtransactionItemErrors = dtransactionItemsErrors.find(item => item.object_id === objectId);
    if (dtransactionItemErrors) {
      dtransactionItemErrors = {
        ...dtransactionItemErrors,
        [propName]: undefined
      };

      const isAnyErrors = Object.entries(dtransactionItemErrors).some(([key, value]) => key !== 'object_id' && value);
      if (isAnyErrors) {
        setDtransactionItemsErrors(prevState => prevState.map(item => {
          if (item.object_id !== objectId) return item;
          return {
            ...item,
            ...dtransactionErrors
          };
        }));
      } else {
        setDtransactionItemsErrors(prevState => prevState.filter(item => item.object_id !== objectId));
      }
    }
  }, [dtransactionItemsErrors]);

  const validateSave = () => {
    let isValid = true;

    if (!dtransaction.remark) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0',
        customClass: {
          container: 'z-9999'
        }
      });
      setDtransactionErrors(prevState => ({
        ...prevState,
        remark: 'Nama barang wajib diisi.'
      }));
    }
    if (!dtransactionItems || dtransactionItems.length === 0) {
      isValid = false;

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0',
        customClass: {
          container: 'z-9999'
        }
      });
      setDtransactionErrors(prevState => ({
        ...prevState,
        items: 'Belum terdapat data barang yang ditambahkan.'
      }));
    }

    let dtransactionItemsErrorCount = 0;
    dtransactionItems.forEach(item => {
      const newDtransactionItemError: TransactionItemErrors = {};

      if (!item.productSelect || item.productSelect.value === '') {
        newDtransactionItemError.product_code = 'Barang wajib diisi'
        dtransactionItemsErrorCount++;
      }

      if (Object.keys(newDtransactionItemError).length > 0) {
        const dtransactionItemError = dtransactionItemsErrors.find(item1 => item1.object_id === item.objectId);

        if (dtransactionItemError) {
          setDtransactionItemsErrors(prevState => prevState.map(item1 => {
            if (item1.object_id !== item.objectId) return item1;
            return {
              ...item1,
              product_code: newDtransactionItemError.product_code
            };
          }));
        } else {
          setDtransactionItemsErrors(prevState => [...prevState, {
            object_id: item.objectId,
            product_code: newDtransactionItemError.product_code
          }]);
        }
      }
    });
    if (dtransactionItemsErrorCount > 0) {
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

  const onSaveClick = useCallback(() => {
    if (!validateSave()) return;

    handleChangeItem && handleChangeItem('items', DTransaction.create({
      ...dtransaction.props,
      items: dtransactionItems.map(item => item.props)
    }));
    handleCloseModal && handleCloseModal();
  }, [dtransactionItems, dtransaction, handleChangeItem, handleCloseModal]);

  const onCancelClick = useCallback(() => {
    handleCloseModal();
  }, [handleCloseModal]);

  return (
    <CardMemo containerClassNames={'w-[90%] h-[90%] md:w-[80%] lg:w-[60%] lg:h-fit'}>
      <div className="flex flex-col gap-y-3 w-full h-full">
        <div className="flex justify-between items-center pt-2 pl-5">
          <span className="font-semibold text-title-xsm">Barang Gabungan</span>
          <IoMdClose
            size={28}
            className={'text-meta-1 cursor-pointer'}
            onClick={handleCloseModal}
          />
        </div>
        <DividerMemo
          direction={'HORIZONTAL'}
          classNames={'border-stroke'}
        />
        <div className="px-8 pb-6 overflow-auto">
          <div className="flex flex-col items-start xl:flex-row justify-between xl:items-end">
            <InputMemo
              label={'Nama Barang'}
              containerClassNames={'w-full xl:w-[400px]'}
              name={'remark'}
              type={'text'}
              isRequired
              value={dtransaction.remark}
              error={dtransactionErrors?.remark}
              handleChange={onInputChange}
            />
            <ButtonMemo
              label={'Tambah Barang'}
              icon={<FaCartPlus size={20} />}
              classNames={'bg-blue-500 w-full mr-auto lg:!w-fit xl:ml-auto xl:!mr-0 mt-5'}
              handleClick={onAddTransactionItemClick}
            />
          </div>
          <div className="
            flex flex-col
            xl:grid
            grid-cols-2
            2xl:grid-cols-3
            gap-8
            rounded border-[1.5px] border-stroke
            h-115
            overflow-y-auto
            mt-6
            p-6
          ">
            {dtransactionItems.map((item, idx) => (
              <TransactionItemMemo
                key={`add-combined-transaction-item-${idx}`}
                index={idx}
                objectId={item.objectId || ''}
                dtransaction={item}
                type={TRANSACTION_TYPE.COMBINE}
                handleChangeItem={onChangeTransactionItem}
                handleDeleteItem={onDeleteTransactionItemClick}
                errors={dtransactionItemsErrors.find(item1 => item1.object_id === item.objectId)}
              />
            ))}
          </div>
          {dtransactionErrors?.items ? (
            <InputLabelErrorMemo
              error={dtransactionErrors.items}
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
  );
};

export default AddCombinedTransactionItemModal;
