import { NavLink } from 'react-router-dom';

import { numericFormat } from '../../../commons/helpers';
import { CustomerReport } from '../../../data/report/domain';

interface ReportCustomerTableRowProps {
  index: number;
  data: CustomerReport;
}

const CustomerReportTableRow: React.FC<ReportCustomerTableRowProps> = (props: ReportCustomerTableRowProps) => {
  const {
    index,
    data
  } = props;

  return (
    <tr>
      <td className="text-center">{numericFormat((index + 1))}.</td>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        <NavLink
          to={`/report/customer/detail/${data.customer?.id}`}
          className={'text-blue-400 hover:underline'}
        >
          {data.customer?.customerName || '-'}
        </NavLink>
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark py-5">
        {numericFormat(data.qty || 0)}x
      </td>
    </tr>
  );
};

export default CustomerReportTableRow;
