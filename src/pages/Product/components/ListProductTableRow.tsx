import { NavLink } from "react-router-dom";
import { FaEdit } from "react-icons/fa";

import { numericFormat } from '../../../commons/helpers';

import { Product } from '../../../data/product/domain';
import { BadgeMemo } from '../../../components/Badge/Badge';

interface ListProductTableRowProps {
  data: Product;
}

const ListProductTableRow: React.FC<ListProductTableRowProps> = (props: ListProductTableRowProps) => {
  const {
    data
  } = props;

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.productName}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark">
        {numericFormat(data.qtyRetail || 0)}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark">
        {numericFormat(data.qtyWarehouse || 0)}
      </td>
      <td align="center" className="border-b border-stroke dark:border-strokedark">
        <BadgeMemo
          label={data.getActiveLabel()}
          containerClassNames={data.isActive ? 'bg-green-500' : 'bg-red-500'}
        />
      </td>
      <td align="center" className="border-b border-stroke dark:border-strokedark">
        <NavLink to={`/product/detail/${data.productCode}`}>
          <FaEdit size={18} />
        </NavLink>
      </td>
    </tr>
  );
};

export default ListProductTableRow;
