import React, { useState, /*useMemo,*/ useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { MdDelete } from 'react-icons/md';

import { BaseSelect } from '../../../commons/common';

import { GetProductsSelectItemRes } from '../../../data/product/contracts';
import { ProductMapper } from '../../../data/product/mapper';
import { ProductService } from '../../../data/product/service';

import { TRANSACTION_TYPE } from '../../../data/transaction/constants';
import { DTransaction } from '../../../data/dtransaction/domain';
import { TransactionItemErrors } from '../../../data/transaction/errors';

import { InputNumberMemo } from '../../../components/InputNumber/InputNumber';
import { SelectMemo } from '../../../components/Select/Select';
import Spinner from '../../../components/Spinner/Spinner';

interface TransactionItemProps {
  index: number;
  objectId: string;
  dtransaction: DTransaction;
  type?: TRANSACTION_TYPE;
  handleChangeItem?: (objectId: string, propName: keyof TransactionItemErrors, newValue: DTransaction) => void;
  handleDeleteItem?: (objectId: string) => void;
  errors?: TransactionItemErrors;
}

const TransactionItem: React.FC<TransactionItemProps> = (props: TransactionItemProps) => {
  const {
    objectId,
    dtransaction,
    type,
    handleChangeItem,
    handleDeleteItem,
    errors
  } = props;

  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [productsSelect, setProductsSelect] = useState<BaseSelect<string>[]>([]);

  const fetchProductsSelect = async () => {
    try {
      setIsFetching(true);

      const { status, data } = await ProductService.getProductsSelect();
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setProductsSelect((data.result || []).map(item => ProductMapper.mapGetProductsSelectItemResToDomain(item)));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  const onDeleteItemClick = useCallback(() => {
    handleDeleteItem && handleDeleteItem(objectId);
  }, [objectId, handleDeleteItem]);

  const onProductSelectOpen = useCallback(() => {
    if (productsSelect.length === 0) fetchProductsSelect();
  }, [productsSelect]);

  const onProductSelectChange = useCallback((item?: SingleValue<BaseSelect<string, GetProductsSelectItemRes>>) => {
    handleChangeItem && handleChangeItem(objectId, "product_code", DTransaction.create({
      ...dtransaction.props,
      product_select: {
        label: item?.label || '',
        value: item?.value || '',
        data: item?.data
      },
    }));
  }, [objectId, dtransaction, handleChangeItem]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    handleChangeItem && handleChangeItem(objectId, event.target.name as keyof TransactionItemErrors, DTransaction.create({
      ...dtransaction.props,
      [event.target.name]: event.target.value
    }));
  }, [objectId, dtransaction, handleChangeItem]);

  return (
    <div className="relative">
      <MdDelete
        size={24}
        className={'absolute top-0 right-0 translate-x-3 -translate-y-2.5 text-red-600 cursor-pointer'}
        onClick={onDeleteItemClick}
      />
      <div className={`flex flex-col gap-y-5 rounded border-[1.5px] ${errors ? 'border-meta-1' : 'border-primary'} p-5`}>
        <SelectMemo
          key={`transaction-item-${objectId}-product-select`}
          label={'Barang'}
          isRequired
          options={productsSelect}
          isSearchable
          isLoading={isFetching}
          placeholder={'Pilih barang'}
          noOptionsMessage={() => 'Data barang tidak ada.'}
          onMenuOpen={onProductSelectOpen}
          value={dtransaction.productSelect}
          onChange={onProductSelectChange}
          error={errors?.product_code}
        />
        <InputNumberMemo
          label={'Quantity'}
          name={'quantity'}
          placeholder={'Masukkan jumlah barang'}
          min={0}
          isRequired
          value={dtransaction.quantity}
          handleChange={onInputChange}
        />
        {type && (type !== TRANSACTION_TYPE.SPLIT && type !== TRANSACTION_TYPE.COMBINE) ? (
          <>
            <InputNumberMemo
              label={'Harga'}
              name={'price'}
              placeholder={'Masukkan harga barang'}
              min={0}
              isRequired
              value={dtransaction.price}
              handleChange={onInputChange}
            />
            <InputNumberMemo
              label={'Diskon (%)'}
              name={'discount'}
              placeholder={'Masukkan diskon barang'}
              min={0}
              max={100}
              value={dtransaction.discount}
              handleChange={onInputChange}
            />
          </>
        ) : null}
      </div>
      {isFetching ? (
        <Spinner />
      ) : null}
    </div>
  );
};

export const TransactionItemMemo = React.memo(TransactionItem);

export default TransactionItem;
