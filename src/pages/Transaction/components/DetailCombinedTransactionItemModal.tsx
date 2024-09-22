import { IoMdClose } from 'react-icons/io';

import { DTransaction } from '../../../data/dtransaction/domain';
import { CombinedDtransactionTableHeaderLabels } from '../../../data/transaction/constants';

import Card from '../../../components/Card/Card';
import Divider from '../../../components/Divider/Divider';
import Table from '../../../components/Table/Table';

import DetailCombinedTransactionItemTableRow from './DetailCombinedTransactionItemTableRow';
import DetailTransactionTableFooter from './DetailTransactionTableFooter';

interface DetailCombinedTransactionItemModalProps {
  item?: DTransaction;
  handleCloseModal: () => void;
}

const DetailCombinedTransactionItemModal: React.FC<DetailCombinedTransactionItemModalProps> = (props: DetailCombinedTransactionItemModalProps) => {
  const {
    item,
    handleCloseModal
  } = props;

  return (
    <Card containerClassNames={'w-[90%] h-fit md:w-[80%] lg:w-[50%]'}>
      <div className="flex flex-col gap-y-3 w-full h-full overflow-auto">
        <div className="flex justify-between items-center pt-2 pl-5">
          <span className="font-semibold text-title-xsm">Daftar Barang</span>
          <IoMdClose
            size={28}
            className={'text-meta-1 cursor-pointer'}
            onClick={handleCloseModal}
          />
        </div>
        <Divider
          direction={'HORIZONTAL'}
          classNames={'border-stroke'}
        />
        <div className="px-8.5 pt-3 pb-8.5">
          <Table
            name='combined-dtransaction'
            hasFooter={true}
            hasPagination={false}
            headerLabels={CombinedDtransactionTableHeaderLabels}
            rowData={item?.items || []}
            RowElement={DetailCombinedTransactionItemTableRow}
            FooterElement={
              <DetailTransactionTableFooter
                items={item?.items || []}
              />
            }
          />
        </div>
      </div>
    </Card>
  );
};

export default DetailCombinedTransactionItemModal;
