import { useCallback } from 'react';
import { FaEye } from 'react-icons/fa6';

import { numericFormat } from '../../../commons/helpers';
import { ProductReport } from '../../../data/report/domain';

export interface ProductReportTableRowExtraProps {
  handleOpenProductTransactionReportModal: (data: ProductReport) => void;
}

interface ProductReportTableRowProps extends ProductReportTableRowExtraProps {
  index: number;
  data: ProductReport;
}

const ProductReportTableRow: React.FC<ProductReportTableRowProps> = (props: ProductReportTableRowProps) => {
  const {
    index,
    data,
    handleOpenProductTransactionReportModal
  } = props;

  const onOpenProductTransactionReportModal = useCallback(() => {
    handleOpenProductTransactionReportModal(data);
  }, [data]);

  return (
    <tr>
      <td className="text-center">{numericFormat((index + 1))}.</td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.product?.productName || '-'}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.qty || 0)}
      </td>
      <td align="center" className="border-b border-stroke dark:border-strokedark">
        <FaEye
          size={18}
          className="cursor-pointer"
          onClick={onOpenProductTransactionReportModal}
        />
      </td>
    </tr>
  );
};

export default ProductReportTableRow;
