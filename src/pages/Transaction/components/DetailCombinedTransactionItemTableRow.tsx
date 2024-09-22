import React from 'react'

import { numericFormat } from '../../../commons/helpers';
import { DTransaction } from '../../../data/dtransaction/domain';

interface DetailCombinedTransactionItemTableRowProps {
  data: DTransaction;
}

const DetailCombinedTransactionItemTableRow: React.FC<DetailCombinedTransactionItemTableRowProps> = (props: DetailCombinedTransactionItemTableRowProps) => {
  const {
    data
  } = props;

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.getProductName() || '-'}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.getQuantity() || 0)}
      </td>
    </tr>
  );
};

export default DetailCombinedTransactionItemTableRow;
