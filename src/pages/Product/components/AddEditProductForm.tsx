import React, { useState, useCallback, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaSave } from "react-icons/fa";
import { MdCancel } from "react-icons/md";
import Swal from "sweetalert2";

import { SWAL_CONFIG } from "../../../constants";

import { Product, InitialProduct } from "../../../data/product/domain";
import { ProductMapper } from '../../../data/product/mapper';
import { ProductService } from '../../../data/product/service';
import { AddProductRes } from '../../../data/product/contracts';
import { AddProductErrors, UpdateProductErrors } from "../../../data/product/errors";

import { InputMemo } from "../../../components/Input/Input";
import { InputTextAreaMemo } from "../../../components/InputTextArea/InputTextArea";
import { InputNumberMemo } from '../../../components/InputNumber/InputNumber';
import { SwitcherMemo } from "../../../components/Switcher/Switcher";
import { ButtonMemo } from "../../../components/Button/Button";

interface AddEditProductFormProps {
  product_code?: string;
  existProduct?: Product;
  handleIsFetching: (isFetch: boolean) => void;
  refetchProduct?: () => void;
}

const AddEditProductForm: React.FC<AddEditProductFormProps> = (props: AddEditProductFormProps) => {
  const navigate = useNavigate();

  const {
    product_code,
    existProduct,
    handleIsFetching,
    refetchProduct
  } = props;

  const [product, setProduct] = useState<Product>(Product.create(InitialProduct));
  const [productErrors, setProductErrors] = useState<AddProductErrors | UpdateProductErrors>();

  useEffect(() => {
    existProduct && setProduct(Product.create({ ...existProduct.props }));
  }, [existProduct]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProduct(prevState => Product.create({
      ...prevState.props,
      [event.target.name]: event.target.value
    }));
    setProductErrors(prevState => ({
      ...prevState,
      [event.target.name]: undefined
    }));
  }, []);

  const onStatusChange = useCallback(() => {
    setProduct(prevState => Product.create({
      ...prevState.props,
      is_active: !prevState.isActive
    }));
  }, [product]);

  const validateAddProduct = (product: Product) => {
    let isValid = true;

    if (!product.productName || product.productName === '') {
      isValid = false;
      setProductErrors(prevState => ({
        ...prevState,
        product_name: 'Nama barang wajib diisi.'
      }));
    }

    if (!isValid) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0'
      });
    }

    return isValid;
  };

  const onSaveClick = useCallback(async () => {
    const validateProductResult = validateAddProduct(product);
    if (!validateProductResult) return;

    try {
      handleIsFetching(true);

      const { status, message, data } = !product_code ?
        await ProductService.addProduct(ProductMapper.mapDomainToAddProductBody(product)) :
        await ProductService.updateProduct({ product_code }, ProductMapper.mapDomainToUpdateProductBody(product));
      if (!status) {
        Swal.fire({
          ...SWAL_CONFIG,
          icon: 'error',
          title: 'Oops...',
          text: message
        });

        return;
      }

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'success',
        title: `${product_code ? 'Ubah' : 'Tambah'} Barang`,
        text: message
      });

      if (!product_code) {
        const insertedProductCode = (data as AddProductRes).product_code;
        insertedProductCode && navigate(`/product/detail/${insertedProductCode}`);
      } else {
        refetchProduct && refetchProduct();
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleIsFetching(false);
      !product_code && setProduct(Product.create(InitialProduct));
    }
  }, [product_code, product, refetchProduct]);

  const onCancelClick = useCallback(() => {
    navigate('/product');
  }, []);

  return (
    <div className="px-8 pb-6">
      <div className="flex flex-col gap-y-7 lg:grid grid-cols-2 lg:gap-8">
        <InputMemo
          label={'Nama Barang'}
          name={'product_name'}
          type={'text'}
          placeholder={'Masukkan nama barang'}
          isRequired
          value={product.productName}
          handleChange={onInputChange}
          error={productErrors?.product_name}
        />
        <InputMemo
          label={'SKU Barang'}
          name={'sku'}
          type={'text'}
          placeholder={'Masukkan SKU barang'}
          value={product.sku || ''}
          handleChange={onInputChange}
        />
        {product_code ? (
          <>
            <InputNumberMemo
              label={'Qty Hugan'}
              name={'qty_retail'}
              min={0}
              isDisabled
              value={product.qtyRetail}
              handleChange={onInputChange}
            />
            <InputNumberMemo
              label={'Qty KRO'}
              name={'qty_warehouse'}
              min={0}
              isDisabled
              value={product.qtyWarehouse}
              handleChange={onInputChange}
            />
          </>
        ) : null}
        <InputTextAreaMemo
          label={'Deskripsi'}
          name={'description'}
          placeholder={'Masukkan deskripsi barang'}
          rows={5}
          value={product.description || ''}
          handleChange={onInputChange}
        />
        {product_code ? (
          <SwitcherMemo
            label={'Aktif'}
            isRequired
            value={product.isActive}
            handleChange={onStatusChange}
          />
        ) : null}
      </div>
      <div className="flex flex-col-reverse md:flex-row md:justify-end items-center gap-4 mt-7">
        <ButtonMemo
          label={'Batalkan'}
          icon={<MdCancel size={20} />}
          classNames={'bg-red-500 w-full md:!w-fit'}
          handleClick={onCancelClick}
        />
        <ButtonMemo
          label={'Simpan'}
          icon={<FaSave size={20} />}
          classNames={'w-full md:!w-fit'}
          handleClick={onSaveClick}
        />
      </div>
      {product_code ? (
        <div className="flex items-center gap-x-10 mt-7.5 italic text-bodydark2">
          <span>Created at: {product.createdAt}</span>
          <span>Updated at: {product.updatedAt}</span>
        </div>
      ) : null}
    </div>
  );
};

export const AddEditProductFormMemo = React.memo(AddEditProductForm);

export default AddEditProductForm;
