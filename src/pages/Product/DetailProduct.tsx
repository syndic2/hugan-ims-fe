import { useState, useCallback, useEffect } from "react";
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { FaCirclePlus } from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";

import { ProductTransactionTableHeaderLabels } from '../../data/product/constants';
import { Product } from '../../data/product/domain';
import { ProductMapper } from '../../data/product/mapper';
import { ProductService } from '../../data/product/service';

import { CardMemo } from '../../components/Card/Card';
import { BackButtonMemo } from '../../components/BackButton/BackButton';
import { DividerMemo } from '../../components/Divider/Divider';
import { TableMemo } from '../../components/Table/Table';
import Spinner from "../../components/Spinner/Spinner";

import { AddEditProductFormMemo } from './components/AddEditProductForm';
import DetailProductTransactionTableRow from './components/DetailProductTransactionTableRow';

const DetailProduct: React.FC = () => {
  const navigate = useNavigate();
  const isSm = useMediaQuery({ query: '(min-width: 640px)' });

  const { product_code } = useParams<{ product_code: string }>();

  const [existProduct, setExistProduct] = useState<Product>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const fetchProduct = async (productCode: string) => {
    try {
      setIsFetching(true);

      const { status, data } = await ProductService.getProduct({ product_code: productCode });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      setExistProduct(ProductMapper.mapGetProductResToDomain(data));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (product_code) fetchProduct(product_code);
  }, [product_code]);

  const handleIsFetching = useCallback((isFetching: boolean) => setIsFetching(isFetching), []);

  const refetchProduct = useCallback(async () => {
    if (product_code) fetchProduct(product_code);
  }, [product_code]);

  return (
    <>
      <div className="relative">
        <CardMemo>
          <div className="flex flex-col gap-y-5">
            <div className="flex justify-between items-center pt-6 px-7.5">
              <div className="flex items-center gap-x-4">
                <BackButtonMemo
                  path={'/product'}
                  label={'Daftar Barang'}
                />
                <DividerMemo direction={'VERTICAL'} />
                <span className="font-semibold text-title-xsm">Detail Barang</span>
              </div>
              <NavLink to={'/product/add'} className="flex items-center gap-x-2 hover:underline cursor-pointer">
                <FaCirclePlus size={isSm ? 20 : 28} />
                {isSm ? <span className="font-semibold text-title-xsm">Tambah Barang</span> : null}
              </NavLink>
            </div>
            <DividerMemo
              direction={'HORIZONTAL'}
              classNames={'border-stroke'}
            />
            <AddEditProductFormMemo
              product_code={product_code}
              existProduct={existProduct}
              handleIsFetching={handleIsFetching}
              refetchProduct={refetchProduct}
            />
          </div>
        </CardMemo>
        {isFetching ? (
          <Spinner />
        ) : null}
      </div>
      <CardMemo containerClassNames={'mt-5'}>
        <div className='flex flex-col gap-y-5 py-6'>
          <span className="font-semibold text-title-xsm px-7.5">
            Daftar Transaksi
          </span>
          <DividerMemo
            direction={'HORIZONTAL'}
            classNames={'border-stroke'}
          />
          <div className="px-7.5">
            <TableMemo
              name={'detail-product-transaction-table'}
              hasPagination={false}
              headerLabels={ProductTransactionTableHeaderLabels}
              rowData={existProduct?.transactions || []}
              RowElement={DetailProductTransactionTableRow}
            />
          </div>
        </div>
      </CardMemo>
    </>
  );
};

export default DetailProduct;
