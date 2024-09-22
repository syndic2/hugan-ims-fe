import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import { SingleValue } from 'react-select';
// import { useMediaQuery } from 'react-responsive';
import { /*FaCirclePlus,*/ FaFilter } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";
import moment from 'moment';

import { BaseSelect } from '../../commons/common';

import {
  TransactionTypeSelect,
  TransactionWarehouseSelect,
  TransactionTableHeaderLabels,
  TRANSACTION_TYPE
} from '../../data/transaction/constants';
import { GetTransactionsQuery } from '../../data/transaction/contracts';
import { Transaction } from '../../data/transaction/domain';
import { TransactionMapper } from '../../data/transaction/mapper';
import { TransactionService } from '../../data/transaction/service';

import { CardMemo } from '../../components/Card/Card';
import DatePicker from '../../components/DatePicker/DatePicker';
import Select from '../../components/Select/Select';
import { DividerMemo } from "../../components/Divider/Divider";
import { PopoverMemo } from "../../components/Popover/Popover";
import { TableMemo } from "../../components/Table/Table";
import Spinner from "../../components/Spinner/Spinner";

import ListTransactionTableRow from './components/ListTransactionTableRow';

const ListTransaction: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // const isLg = useMediaQuery({ query: '(min-width: 1024px)' });

  const [listTransactionFilters, setListTransactionFilters] = useState<GetTransactionsQuery>({
    page: 1,
    limit: 10,
    transaction_type: TRANSACTION_TYPE.SALE
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [isOpenPopoverFilter, setIsOpenPopoverFilter] = useState<boolean>(false);

  const fetchTransactions = async () => {
    try {
      setIsFetching(true);

      const { data } = await TransactionService.getTransactions(listTransactionFilters);
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setTransactions((data.result || []).map(item => TransactionMapper.mapGetTransactionsItemResToDomain(item)));
      setTotalPage(data.total_page || 0);
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  // GET SEARCH PARAMS
  useEffect(() => {
    const q = searchParams.get('q') || listTransactionFilters.q;
    const page = Number(searchParams.get('page')) || listTransactionFilters.page;
    const limit = Number(searchParams.get('limit')) || listTransactionFilters.limit;
    const start_date = searchParams.get('start_date') || listTransactionFilters.start_date;
    const end_date = searchParams.get('end_date') || listTransactionFilters.end_date;
    const transaction_type = searchParams.get('transaction_type') || listTransactionFilters.transaction_type;
    const warehouse_id = searchParams.get('warehouse_id') || listTransactionFilters.warehouse_id;

    setListTransactionFilters(prevState => ({
      ...prevState,
      ...q && { q },
      page,
      limit,
      start_date,
      end_date,
      transaction_type,
      warehouse_id
    }));
  }, []);

  // SET SEARCH PARAMS
  useEffect(() => {
    const { q, page, limit, start_date, end_date, transaction_type, warehouse_id } = listTransactionFilters;
    const newSearchParams = new URLSearchParams();

    if (q) newSearchParams.append('q', q);
    if (page && page !== 0) newSearchParams.append('page', page.toString());
    if (limit && limit !== 0) newSearchParams.append('limit', limit.toString());
    if (start_date) newSearchParams.append('start_date', start_date.toString());
    if (end_date) newSearchParams.append('end_date', end_date.toString());
    if (transaction_type) newSearchParams.append('transaction_type', transaction_type);
    if (warehouse_id) newSearchParams.append('warehouse_id', warehouse_id);

    setSearchParams(newSearchParams);
  }, [listTransactionFilters]);

  useEffect(() => {
    fetchTransactions();
  }, [listTransactionFilters]);

  const onPopoverFilterClick = () => {
    setIsOpenPopoverFilter(prevState => !prevState);
  };

  const onPopoverFilterOutsideClick = useCallback(() => {
    setIsOpenPopoverFilter(false);
  }, []);

  const filterIconRef = useRef<HTMLDivElement>(null);

  const excludeRefElementsMemo = useMemo((): React.RefObject<HTMLDivElement>[] => {
    return [
      filterIconRef
    ];
  }, []);

  const onChangeTransactionDate = useCallback((name: string, dates: Date[]) => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      [name]: moment(dates[0]).format('Y-MM-DD')
    }));
  }, []);

  const onTransactionTypeSelectChange = useCallback((item?: SingleValue<BaseSelect<string>>) => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      transaction_type: item?.value
    }));
  }, []);

  const onTransactionWarehouseSelectChange = useCallback((item?: SingleValue<BaseSelect<string>>) => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      warehouse_id: item?.value
    }));
  }, []);

  const FilterPopoverContent = useMemo((): JSX.Element => {
    return (
      <div className="flex flex-col gap-y-5 md:w-[350px] p-4">
        <DatePicker
          name={'start_date'}
          label={'Tanggal Awal'}
          handleChange={onChangeTransactionDate}
        />
        <DatePicker
          name={'end_date'}
          label={'Tanggal Akhir'}
          handleChange={onChangeTransactionDate}
        />
        <Select
          key={'list-transaction-transaction-type-select'}
          label={'Tipe Transaksi'}
          defaultValue={TransactionTypeSelect[1]}
          options={TransactionTypeSelect}
          placeholder={'Pilih Tipe'}
          onChange={onTransactionTypeSelectChange}
        />
        <Select
          key={'list-transaction-warehouse-select'}
          label={'Gudang'}
          defaultValue={TransactionWarehouseSelect[0]}
          options={TransactionWarehouseSelect}
          placeholder={'Pilih Gudang'}
          onChange={onTransactionWarehouseSelectChange}
        />
      </div>
    );
  }, []);

  const onPrevPageClick = useCallback(() => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setListTransactionFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  return (
    <div className="relative">
      <CardMemo containerClassNames="py-6">
        <div className="flex flex-col gap-y-5">
          <div className="flex gap-y-3 justify-between items-center px-7.5">
            <span className="font-semibold text-title-xsm">Daftar Transaksi</span>
            {/* <div className="flex items-center gap-x-4">
              {isLg ? (
                <>
                  <DividerMemo direction={'VERTICAL'} />
                  <div className="flex items-center gap-x-2 hover:underline cursor-pointe invisible md:visible cursor-pointer">
                    <FaCirclePlus size={20} />
                    <span className="font-semibold text-title-xsm">Tambah Transaksi</span>
                  </div>
                </>
              ) : null}
            </div> */}
            <div className="flex items-center gap-x-4">
              <div className="relative">
                <div ref={filterIconRef} className="flex-grow border rounded border-bodydark1 dark:border-bodydark2 p-3">
                  <FaFilter
                    size={20}
                    className="cursor-pointer"
                    onClick={onPopoverFilterClick}
                  />
                </div>
                <PopoverMemo
                  isOpen={isOpenPopoverFilter}
                  excludeRefElements={excludeRefElementsMemo}
                  handleOutsideClick={onPopoverFilterOutsideClick}
                  children={FilterPopoverContent}
                />
              </div>
            </div>
          </div>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="relative w-full mt-5 px-7.5">
            <TableMemo
              name={'list-transaction-table'}
              headerLabels={TransactionTableHeaderLabels}
              rowData={transactions}
              currentPage={listTransactionFilters.page}
              totalPage={totalPage}
              showPageCount={2}
              RowElement={ListTransactionTableRow}
              handlePrevPageClick={onPrevPageClick}
              handleNextPageClick={onNextPageClick}
              handleSelectedPageClick={onSelectedPageClick}
            />
            {isFetching ? (
              <Spinner />
            ) : null}
          </div>
        </div>
      </CardMemo>
      <NavLink to="/product/add">
        <IoIosAddCircle
          size={48}
          className="fixed z-999 right-0 bottom-0 text-primary dark:text-bodydark1 visible md:invisible"
        />
      </NavLink>
    </div>
  );
};

export default ListTransaction;
