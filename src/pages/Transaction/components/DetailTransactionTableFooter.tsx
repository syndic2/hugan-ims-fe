import { numericFormat } from '../../../commons/helpers';
import { DTransaction } from '../../../data/dtransaction/domain';

interface DetailTransactionTableFooterProps {
  items: DTransaction[];
}

const DetailTransactionTableFooter: React.FC<DetailTransactionTableFooterProps> = (props: DetailTransactionTableFooterProps) => {
  const {
    items
  } = props;

  const totalQuantity = items.reduce((acc, item) => acc += item.quantity || 0, 0);

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        <span className="font-bold">TOTAL :</span>
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        <span className="font-bold">{numericFormat(totalQuantity || 0)}</span>
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
      </td>
    </tr>
  )
};

export default DetailTransactionTableFooter;

