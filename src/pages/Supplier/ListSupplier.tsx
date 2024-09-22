import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import Select, { SingleValue } from 'react-select';
import { useDebouncedCallback } from 'use-debounce';
import { useMediaQuery } from 'react-responsive';
import { FaCirclePlus, FaFilter } from 'react-icons/fa6';
import { IoIosAddCircle } from "react-icons/io";

import { TableHeaderLabels, StatusSupplierOptions } from '../../data/supplier/constants';
import { GetSuppliersQuery } from '../../data/supplier/contracts';
import { Supplier } from '../../data/supplier/domain';
import { SupplierMapper } from '../../data/supplier/mapper';
import { SupplierService } from '../../data/supplier/service';

import { CardMemo } from '../../components/Card/Card';
import { PopoverMemo } from '../../components/Popover/Popover';
import { DividerMemo } from '../../components/Divider/Divider';
import { InputMemo } from '../../components/Input/Input';
import { TableMemo } from '../../components/Table/Table';
import Spinner from '../../components/Spinner/Spinner';

import ListSupplierTableRow from './components/ListSupplierTableRow';

const ListSupplier: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isLg = useMediaQuery({ query: '(min-width: 1024px)' });

  const [listSupplierFilters, setListSupplierFilters] = useState<GetSuppliersQuery>({
    page: 1,
    limit: 10,
    is_active: true
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [isOpenPopoverFilter, setIsOpenPopoverFilter] = useState<boolean>(false);

  const fetchSuppliers = async () => {
    try {
      setIsFetching(true);

      const { data } = await SupplierService.getSuppliers(listSupplierFilters);
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setSuppliers((data.result || []).map((item) => SupplierMapper.mapGetSuppliersItemResToDomain(item)));
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
    const q = searchParams.get('q') || listSupplierFilters.q;
    const page = Number(searchParams.get('page')) || listSupplierFilters.page;
    const limit = Number(searchParams.get('limit')) || listSupplierFilters.limit;
    const is_active = searchParams.get('is_active');
    const isActive = is_active && is_active === 'true' ? true : listSupplierFilters.is_active;

    setListSupplierFilters((prevState) => ({
      ...prevState,
      ...q && { q },
      page,
      limit,
      is_active: isActive
    }));
  }, []);

  // SET SEARCH PARAMS
  useEffect(() => {
    const { q, page, limit, is_active } = listSupplierFilters;
    const newSearchParams = new URLSearchParams();

    if (q) newSearchParams.append('q', q);
    if (page) newSearchParams.append('page', page.toString());
    if (limit) newSearchParams.append('limit', limit.toString());
    if (is_active !== undefined) newSearchParams.append('is_active', is_active.toString());

    setSearchParams(newSearchParams);
  }, [listSupplierFilters]);

  useEffect(() => {
    fetchSuppliers();
  }, [listSupplierFilters]);

  const onSearchChange = useDebouncedCallback(useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setListSupplierFilters(prevState => ({
      ...prevState,
      q: e.target.value
    }));
  }, []), 500);

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

  const onStatusSupplierSelectChange = useCallback((item?: SingleValue<{ label: string, value: boolean }>) => {
    setListSupplierFilters(prevState => ({
      ...prevState,
      is_active: item?.value
    }));
  }, []);

  const FilterPopoverContent = useMemo((): JSX.Element => {
    return (
      <div className="w-[200px] p-4">
        <div className="flex flex-col">
          <label className="mb-2.5 block font-medium text-bodydark2 dark:text-white">Status</label>
          <Select
            name={'list-supplier-supplier-status-select'}
            defaultValue={StatusSupplierOptions[0]}
            options={StatusSupplierOptions}
            placeholder={'Pilih status'}
            onChange={onStatusSupplierSelectChange}
          />
        </div>
      </div>
    );
  }, []);

  const onPrevPageClick = useCallback(() => {
    setListSupplierFilters((prevState) => ({
      ...prevState,
      page: prevState.page - 1,
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setListSupplierFilters((prevState) => ({
      ...prevState,
      page: prevState.page + 1,
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setListSupplierFilters((prevState) => ({
      ...prevState,
      page,
    }));
  }, []);

  return (
    <div className="relative">
      <CardMemo containerClassNames="py-6">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-3 md:flex-row md:justify-between md:items-center px-7.5">
            <div className="flex items-center gap-x-4">
              <span className="font-semibold text-title-xsm">Daftar Supplier</span>
              {isLg ? (
                <>
                  <DividerMemo direction={'VERTICAL'} />
                  <NavLink to={'/supplier/add'} className="flex items-center gap-x-2 hover:underline cursor-pointe invisible md:visible">
                    <FaCirclePlus size={20} />
                    <span className="font-semibold text-title-xsm">Tambah Supplier</span>
                  </NavLink>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-x-4">
              <InputMemo
                name={'q'}
                type={'text'}
                placeholder={'Cari nama supplier...'}
                isSearch
                containerClassNames={'w-full md:w-[400px]'}
                handleChange={onSearchChange}
              />
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
              name={'supplier'}
              headerLabels={TableHeaderLabels}
              rowData={suppliers}
              currentPage={listSupplierFilters.page}
              totalPage={totalPage}
              showPageCount={2}
              RowElement={ListSupplierTableRow}
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
      <NavLink to="/supplier/add">
        <IoIosAddCircle
          size={48}
          className="fixed z-999 right-0 bottom-0 text-primary dark:text-bodydark1 visible md:invisible"
        />
      </NavLink>
    </div>
  );
};

export default ListSupplier;
