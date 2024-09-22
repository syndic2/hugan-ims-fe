import { NavLink } from 'react-router-dom';
import { FaEye } from 'react-icons/fa6';

import { Transaction } from '../../../data/transaction/domain';

interface DetailProductTransactionTableRowProps {
  data: Transaction;
}

const DetailProductTransactionTableRow: React.FC<DetailProductTransactionTableRowProps> = (props: DetailProductTransactionTableRowProps) => {
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
      <td align="center" className="border-b border-stroke dark:border-strokedark">
        <NavLink to={`/transaction/detail/${data.transactionId}`}>
          <FaEye size={18} />
        </NavLink>
      </td>
    </tr>
  );
};

export default DetailProductTransactionTableRow;
