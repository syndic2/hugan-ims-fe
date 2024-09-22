import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import Select, { SingleValue } from 'react-select';
import { useDebouncedCallback } from "use-debounce";
import { useMediaQuery } from 'react-responsive';
import { FaCirclePlus, FaFilter } from "react-icons/fa6";
import { IoIosAddCircle } from "react-icons/io";

import { TableHeaderLabels, StatusProductOptions } from "../../data/product/constants";
import { GetProductsQuery } from '../../data/product/contracts';
import { Product } from "../../data/product/domain";
import { ProductMapper } from "../../data/product/mapper";
import { ProductService } from '../../data/product/service';

import { CardMemo } from '../../components/Card/Card';
import { DividerMemo } from "../../components/Divider/Divider";
import { PopoverMemo } from "../../components/Popover/Popover";
import { InputMemo } from "../../components/Input/Input";
import { TableMemo } from "../../components/Table/Table";
import Spinner from "../../components/Spinner/Spinner";

import ListProductTableRow from "./components/ListProductTableRow";

const ListProduct: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const isLg = useMediaQuery({ query: '(min-width: 1024px)' });

  const [listProductFilters, setListProductFilters] = useState<GetProductsQuery>({
    page: 1,
    limit: 10,
    is_active: true
  });
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPage, setTotalPage] = useState<number>(0);

  const [isOpenPopoverFilter, setIsOpenPopoverFilter] = useState<boolean>(false);

  const fetchProducts = async () => {
    try {
      setIsFetching(true);

      const { data } = await ProductService.getProducts(listProductFilters);
      if (!data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setProducts((data.result || []).map(item => ProductMapper.mapGetProductsItemResToDomain(item)));
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
    const q = searchParams.get('q') || listProductFilters.q;
    const page = Number(searchParams.get('page')) || listProductFilters.page;
    const limit = Number(searchParams.get('limit')) || listProductFilters.limit;
    const is_active = searchParams.get('is_active');
    const isActive = is_active && is_active === 'true' ? true : listProductFilters.is_active;

    setListProductFilters(prevState => ({
      ...prevState,
      ...q && { q },
      page,
      limit,
      is_active: isActive
    }));
  }, []);

  // SET SEARCH PARAMS
  useEffect(() => {
    const { q, page, limit, is_active } = listProductFilters;
    const newSearchParams = new URLSearchParams();

    if (q) newSearchParams.append('q', q);
    if (page && page !== 0) newSearchParams.append('page', page.toString());
    if (limit && limit !== 0) newSearchParams.append('limit', limit.toString());
    if (is_active !== undefined) newSearchParams.append('is_active', is_active.toString());

    setSearchParams(newSearchParams);
  }, [listProductFilters]);

  useEffect(() => {
    fetchProducts();
  }, [listProductFilters]);

  const onSearchChange = useDebouncedCallback(useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setListProductFilters(prevState => ({
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

  const onStatusProductSelectChange = useCallback((item?: SingleValue<{ label: string, value: boolean }>) => {
    setListProductFilters(prevState => ({
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
            name={'list-product-product-status-select'}
            defaultValue={StatusProductOptions[0]}
            options={StatusProductOptions}
            placeholder={'Pilih status'}
            onChange={onStatusProductSelectChange}
          />
        </div>
      </div>
    );
  }, []);

  const onPrevPageClick = useCallback(() => {
    setListProductFilters(prevState => ({
      ...prevState,
      page: prevState.page - 1
    }));
  }, []);

  const onNextPageClick = useCallback(() => {
    setListProductFilters(prevState => ({
      ...prevState,
      page: prevState.page + 1
    }));
  }, []);

  const onSelectedPageClick = useCallback((page: number) => {
    setListProductFilters(prevState => ({
      ...prevState,
      page
    }));
  }, []);

  return (
    <div className="relative">
      <CardMemo containerClassNames="py-6">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-col gap-y-3 md:flex-row md:justify-between md:items-center px-7.5">
            <div className="flex items-center gap-x-4">
              <span className="font-semibold text-title-xsm">Daftar Barang</span>
              {isLg ? (
                <>
                  <DividerMemo direction={'VERTICAL'} />
                  <NavLink to={'/product/add'} className="flex items-center gap-x-2 hover:underline cursor-pointe invisible md:visible">
                    <FaCirclePlus size={20} />
                    <span className="font-semibold text-title-xsm">Tambah Barang</span>
                  </NavLink>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-x-4">
              <InputMemo
                name={'q'}
                type={'text'}
                placeholder={'Cari nama barang...'}
                isSearch
                containerClassNames={'w-full md:w-[400px]'}
                classNames={'w-full'}
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
              name={'product'}
              headerLabels={TableHeaderLabels}
              rowData={products}
              currentPage={listProductFilters.page}
              totalPage={totalPage}
              showPageCount={2}
              RowElement={ListProductTableRow}
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

export default ListProduct;
