import { NavLink } from "react-router-dom";
import { FaEye } from "react-icons/fa";

import { numericFormat, rupiahFormat } from '../../../commons/helpers';
import { Transaction } from '../../../data/transaction/domain';

interface ListTransactionTableRowProps {
  data: Transaction;
}

const ListTransactionTableRow: React.FC<ListTransactionTableRowProps> = (props: ListTransactionTableRowProps) => {
  const {
    data
  } = props;

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.notaId}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.createdAt}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.getTransactionTypeLabel()}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.warehouseId}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.supplier?.supplierName || '-'}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.customer?.customerName || '-'}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.items || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {rupiahFormat(data.total || 0)}
      </td>
      <td align="center" className="border-b border-stroke dark:border-strokedark">
        <NavLink to={`/transaction/detail/${data.transactionId}`}>
          <FaEye size={18} />
        </NavLink>
      </td>
    </tr>
  );
};

export default ListTransactionTableRow;
