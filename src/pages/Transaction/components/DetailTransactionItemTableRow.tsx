import React, { useMemo, useCallback } from 'react'
import { FaEye } from 'react-icons/fa';

import { numericFormat } from '../../../commons/helpers';
import { DTransaction } from '../../../data/dtransaction/domain';

export interface DetailTransactionItemTableRowExtraProps {
  handleOpenCombinedItemModal: (item: DTransaction) => void;
}

interface DetailTransactionItemTableRowProps extends DetailTransactionItemTableRowExtraProps {
  data: DTransaction;
}

const DetailTransactionItemTableRow: React.FC<DetailTransactionItemTableRowProps> = (props: DetailTransactionItemTableRowProps) => {
  const {
    data,
    handleOpenCombinedItemModal
  } = props;

  const onOpenCombinedItemModal = useCallback(() => {
    handleOpenCombinedItemModal(data);
  }, [data]);

  const subTotalBeforeDiscount = useMemo((): number => (data.subTotal || 0) + (data.discount || 0), [data.subTotal, data.discount]);

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.getProductName() || '-'}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.quantity || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.price || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(subTotalBeforeDiscount)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.discount || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.subTotal || 0)}
      </td>
      {data.isCombined ? (
        <td align="center" className="border-b border-stroke dark:border-strokedark py-5">
          <FaEye
            size={18}
            className="cursor-pointer"
            onClick={onOpenCombinedItemModal}
          />
        </td>
      ) : (
        <td className=" border-b border-stroke dark:border-strokedark"></td>
      )}
    </tr>
  );
};

export default DetailTransactionItemTableRow;
