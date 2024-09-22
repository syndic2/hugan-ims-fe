import { NavLink } from 'react-router-dom';
import { FaEdit } from 'react-icons/fa';

import { Supplier } from '../../../data/supplier/domain';
import { BadgeMemo } from '../../../components/Badge/Badge';

interface ListSupplierTableRowProps {
  data: Supplier;
}

const ListSupplierTableRow: React.FC<ListSupplierTableRowProps> = (props: ListSupplierTableRowProps,) => {
  const { data } = props;

  return (
    <tr>
      <td className="text-left border-b border-stroke dark:border-strokedark py-5">
        {data.supplierName}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark">
        {data.npwp || '-'}
      </td>
      <td className="text-right border-b border-stroke dark:border-strokedark">
        {data.address || '-'}
      </td>
      <td
        align="center"
        className="border-b border-stroke dark:border-strokedark"
      >
        <BadgeMemo
          label={data.getActiveLabel()}
          containerClassNames={data.isActive ? 'bg-green-500' : 'bg-red-500'}
        />
      </td>
      <td
        align="center"
        className="border-b border-stroke dark:border-strokedark"
      >
        <NavLink to={`/supplier/detail/${data.id}`}>
          <FaEdit size={18} />
        </NavLink>
      </td>
    </tr>
  );
};

export default ListSupplierTableRow;
