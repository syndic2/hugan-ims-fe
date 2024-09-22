import { numericFormat, rupiahFormat } from '../../../commons/helpers';
import { TransactionReport } from '../../../data/report/domain'

interface ProductTransactionReportModalTableRowProps {
  data: TransactionReport;
}

const ProductTransactionReportModalTableRow: React.FC<ProductTransactionReportModalTableRowProps> = (props: ProductTransactionReportModalTableRowProps) => {
  const {
    data
  } = props;

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.transactionId}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.transactionDate}
      </td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.name}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.quantity || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {rupiahFormat(data.price || 0)}
      </td>
    </tr>
  );
};

export default ProductTransactionReportModalTableRow;
