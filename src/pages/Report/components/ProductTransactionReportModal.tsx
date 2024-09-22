import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoMdClose } from 'react-icons/io';

import { ProductTransactionReportModalTableHeaderLabels } from '../../../data/report/constants';
import { ProductReport } from '../../../data/report/domain';
import { TransactionReport } from '../../../data/report/domain';
import { ReportMapper } from '../../../data/report/mapper';
import { ReportService } from '../../../data/report/service';
import { GetTransactionReportsQuery } from '../../../data/report/contracts';

import { CardMemo } from '../../../components/Card/Card';
import { DividerMemo } from '../../../components/Divider/Divider';
import { TableMemo } from '../../../components/Table/Table';
import { ModalMemo } from '../../../components/Modal/Modal';
import Spinner from '../../../components/Spinner/Spinner';

import { ReportFilterProps } from '../PurchaseReport';
import ProductTransactionReportModalTableRow from './ProductTransactionReportModalTableRow';

interface ProductTransactionReportModalProps {
  isOpen: boolean;
  transactionTypeLabel: string;
  reportFilters?: ReportFilterProps;
  productReport?: ProductReport;
  handleCloseModal: () => void;
}

const ProductTransactionReportModal: React.FC<ProductTransactionReportModalProps> = (props: ProductTransactionReportModalProps) => {
  const navigate = useNavigate();

  const {
    isOpen,
    transactionTypeLabel,
    reportFilters,
    productReport,
    handleCloseModal
  } = props;

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transactionReportFilters, setTransactionReportFilters] = useState<GetTransactionReportsQuery>({
    page: 1,
    limit: 50,
    warehouse_id: reportFilters?.warehouse_select?.value,
    transaction_type: reportFilters?.transaction_type,
    product_code: productReport?.product?.productCode,
    start_date: reportFilters?.start_date,
    end_date: reportFilters?.end_date
  });
  const [transactionReports, setTransactionReports] = useState<TransactionReport[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const fetchTransactionReports = async () => {
    try {
      setIsFetching(true);

      const { data } = await ReportService.getTransactionReports(transactionReportFilters);
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setTransactionReports((data.result || []).map(item => ReportMapper.mapGetTransactionReportsItemResToDomain(item)));
      setTotalPage(data.total_page || 0);
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchTransactionReports();
  }, [reportFilters]);

  const onPrevPageClick = useCallback(() => {
    setTransactionReportFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setTransactionReportFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setTransactionReportFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  return (
    <ModalMemo isOpen={isOpen}>
      <div className={`
        relative
        w-[90%] ${transactionReports.length <= 5 ? 'h-fit' : 'h-[90%]'}
        md:w-[80%] md:${transactionReports.length <= 5 ? 'h-fit' : 'h-[80%]'}
        lg:w-[50%] lg:${transactionReports.length <= 5 ? 'h-fit' : 'h-[50%]'}
      `}>
        <CardMemo containerClassNames={'w-full h-full'}>
          <div className="flex flex-col gap-y-3 w-full h-full">
            <div className="flex justify-between items-center pt-2 pl-5">
              <span className="font-semibold text-title-xsm">Daftar Transaksi {transactionTypeLabel} - {productReport?.product?.productName}</span>
              <IoMdClose
                size={28}
                className={'text-meta-1 cursor-pointer'}
                onClick={handleCloseModal}
              />
            </div>
            <DividerMemo
              direction={'HORIZONTAL'}
              classNames={'border-stroke'}
            />
            <div className="flex-1 px-8.5 pt-3 pb-8.5 h-[80%]">
              <TableMemo
                name='product-transaction-report-table'
                headerLabels={ProductTransactionReportModalTableHeaderLabels}
                rowData={transactionReports}
                currentPage={transactionReportFilters.page}
                totalPage={totalPage}
                showPageCount={2}
                RowElement={ProductTransactionReportModalTableRow}
                handlePrevPageClick={onPrevPageClick}
                handleNextPageClick={onNextPageClick}
                handleSelectedPageClick={onSelectedPageClick}
              />
            </div>
          </div>
        </CardMemo>
        {isFetching ? (
          <Spinner />
        ) : null}
      </div>
    </ModalMemo>
  );
};

export default ProductTransactionReportModal;
