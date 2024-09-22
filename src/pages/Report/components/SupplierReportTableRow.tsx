import { NavLink } from 'react-router-dom';

import { numericFormat } from '../../../commons/helpers';
import { SupplierReport } from '../../../data/report/domain';

interface SupplierReportTableRowProps {
  index: number;
  data: SupplierReport;
}

const SupplierReportTableRow: React.FC<SupplierReportTableRowProps> = (props: SupplierReportTableRowProps) => {
  const {
    index,
    data
  } = props;

  return (
    <tr>
      <td className="text-center">{numericFormat((index + 1))}.</td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        <NavLink
          to={`/supplier/detail/${data.supplier?.id}`}
          className={'text-blue-400 hover:underline'}
        >
          {data.supplier?.supplierName || '-'}
        </NavLink>
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.qty || 0)}x
      </td>
    </tr>
  );
};

export default SupplierReportTableRow;
