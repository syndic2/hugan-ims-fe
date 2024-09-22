import React, { useState, useMemo, useCallback } from 'react';
import { MdDelete } from 'react-icons/md';
import { MdEdit } from 'react-icons/md';

import { numericFormat } from '../../../commons/helpers';

import { TRANSACTION_TYPE } from '../../../data/transaction/constants';
import { CombinedTransactionItemErrors } from '../../../data/transaction/errors';
import { DTransaction } from '../../../data/dtransaction/domain';

import { InputLabelMemo } from '../../../components/InputLabel/InputLabel';
import { InputLabelErrorMemo } from '../../../components/InputLabelError/InputLabelError';
import { InputMemo } from '../../../components/Input/Input';
import { InputNumberMemo } from '../../../components/InputNumber/InputNumber';
import { ModalMemo } from '../../../components/Modal/Modal';

import AddCombinedTransactionItemModal from './AddCombinedTransactionItemModal';

interface CombinedTransactionItemProps {
  index: number;
  objectId: string;
  type?: TRANSACTION_TYPE;
  dtransaction: DTransaction;
  handleChangeCombinedItem?: (objectId: string, propName: keyof CombinedTransactionItemErrors, newValue: DTransaction) => void;
  handleDeleteCombinedItem?: (objectId: string) => void;
  errors?: CombinedTransactionItemErrors;
}

const CombinedTransactionItem: React.FC<CombinedTransactionItemProps> = (props: CombinedTransactionItemProps) => {
  const {
    objectId,
    type,
    dtransaction,
    handleChangeCombinedItem,
    handleDeleteCombinedItem,
    errors
  } = props;

  const [isOpenAddItemModal, setIsOpenAddItemModal] = useState<boolean>(false);

  const onDeleteItemClick = useCallback(() => {
    handleDeleteCombinedItem && handleDeleteCombinedItem(objectId);
  }, [objectId, handleDeleteCombinedItem]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeCombinedItem && handleChangeCombinedItem(objectId, event.target.name as keyof CombinedTransactionItemErrors, DTransaction.create({
      ...dtransaction.props,
      [event.target.name]: event.target.value
    }));
  }, [objectId, dtransaction, handleChangeCombinedItem]);

  const onOpenAddItemModalClick = () => {
    setIsOpenAddItemModal(true);
  };

  const onCloseAddItemModalClick = useCallback(() => {
    setIsOpenAddItemModal(false);
  }, []);

  const onChangeItemModal = useCallback((propName: string, newValue: DTransaction) => {
    handleChangeCombinedItem && handleChangeCombinedItem(objectId, propName as keyof CombinedTransactionItemErrors, DTransaction.create({
      ...dtransaction.props,
      ...newValue.props
    }));
  }, [objectId, dtransaction, handleChangeCombinedItem]);

  const dtransactionItems = useMemo(() => (dtransaction.items || []).splice(0, 2), [dtransaction]);

  const showMoreDtransactionItems = useMemo(() => (dtransaction.items?.length || 0) - dtransactionItems.length > 0 ? (dtransaction.items?.length || 0) - dtransactionItems.length : dtransaction.items?.length || 0, [dtransaction, dtransactionItems]);

  return (
    <>
      <div className="relative">
        <MdDelete
          size={24}
          className={'absolute top-0 right-0 translate-x-3 -translate-y-2.5 text-red-600 cursor-pointer'}
          onClick={onDeleteItemClick}
        />
        <div className={`flex flex-col gap-y-5 rounded border-[1.5px] ${errors ? 'border-meta-1' : 'border-primary'} p-5 h-fit`}>
          <InputMemo
            label={'Nama Barang'}
            name={'remark'}
            type={'text'}
            placeholder={'Masukkan nama barang'}
            isRequired
            value={dtransaction.remark}
            handleChange={onInputChange}
            error={errors?.remark}
          />
          <InputNumberMemo
            label={'Quantity'}
            name={'quantity'}
            min={0}
            isRequired
            value={dtransaction.quantity}
            handleChange={onInputChange}
          />
          {!type || (type && type !== TRANSACTION_TYPE.DELIVERY_NOTE) ? (
            <>
              <InputNumberMemo
                label={'Harga'}
                name={'price'}
                min={0}
                isRequired
                value={dtransaction.price}
                handleChange={onInputChange}
              />
              <InputNumberMemo
                label={'Diskon (%)'}
                name={'discount'}
                min={0}
                max={100}
                value={dtransaction.discount}
                handleChange={onInputChange}
              />
              <div className="flex flex-col gap-y-4 h-full">
                <div className="flex items-center gap-x-2">
                  <InputLabelMemo
                    label={'Daftar Barang'}
                    className={'!mb-0'}
                  />
                  <MdEdit
                    size={20}
                    className={'text-primary cursor-pointer'}
                    onClick={onOpenAddItemModalClick}
                  />
                </div>
                {dtransactionItems.map((item, idx) => (
                  <div key={`combined-transaction-item-dtransactions-item-${idx}`} className="rounded border-[1.5px] border-primary p-2">
                    <span className="text-base">
                      {item.productSelect?.label} - {numericFormat(item.quantity || 0)} Qty
                    </span>
                  </div>
                ))}
                {(dtransaction.items?.length || 0) > 0 ? (
                  <div
                    className="bg-blue-600 p-3 cursor-pointer rounded hover:bg-opacity-90 mt-auto"
                    onClick={onOpenAddItemModalClick}
                  >
                    <span className="text-base text-white">Barang Lainnya (+{showMoreDtransactionItems})</span>
                  </div>
                ) : null}
              </div>
              {errors?.items ? (
                <InputLabelErrorMemo
                  error={errors.items}
                />
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      {!type || (type && type === TRANSACTION_TYPE.DELIVERY_NOTE) ? (
        <ModalMemo
          isOpen={isOpenAddItemModal}
        >
          <AddCombinedTransactionItemModal
            dtransaction={dtransaction}
            handleChangeItem={onChangeItemModal}
            handleCloseModal={onCloseAddItemModalClick}
          />
        </ModalMemo>
      ) : null}
    </>
  );
};

export const CombinedTransactionItemMemo = React.memo(CombinedTransactionItem);

export default CombinedTransactionItem;
