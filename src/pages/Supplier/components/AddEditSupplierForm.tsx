import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';

import { SWAL_CONFIG } from '../../../constants';

import { Supplier, InitialSupplier } from '../../../data/supplier/domain';
import { SupplierMapper } from '../../../data/supplier/mapper';
import { SupplierService } from '../../../data/supplier/service';
import { AddSupplierRes } from '../../../data/supplier/contracts';
import { AddSupplierErrors, UpdateSupplierErrors } from '../../../data/supplier/errors';

import { InputMemo } from '../../../components/Input/Input';
import { SwitcherMemo } from '../../../components/Switcher/Switcher';
import { ButtonMemo } from '../../../components/Button/Button';

interface AddEditSupplierFormProps {
  id?: string;
  existSupplier?: Supplier;
  handleIsFetching: (isFetch: boolean) => void;
  refetchSupplier?: () => void;
}

const AddEditSupplierForm: React.FC<AddEditSupplierFormProps> = (props: AddEditSupplierFormProps) => {
  const navigate = useNavigate();

  const {
    id,
    existSupplier,
    handleIsFetching,
    refetchSupplier
  } = props;

  const [supplier, setSupplier] = useState<Supplier>(Supplier.create(InitialSupplier));
  const [supplierErrors, setSupplierErrors] = useState<AddSupplierErrors | UpdateSupplierErrors>();

  useEffect(() => {
    existSupplier && setSupplier(Supplier.create({ ...existSupplier.props }));
  }, [existSupplier]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSupplier((prevState) => Supplier.create({
      ...prevState.props,
      [event.target.name]: event.target.value,
    }));
    setSupplierErrors((prevState) => ({
      ...prevState,
      [event.target.name]: undefined
    }));
  }, []);

  const onStatusChange = useCallback(() => {
    setSupplier(prevState => Supplier.create({
      ...prevState.props,
      is_active: !prevState.isActive
    }));
  }, []);

  const validateAddSupplier = (supplier: Supplier) => {
    let isValid = true;

    if (!supplier.supplierName || supplier.supplierName === '') {
      isValid = false;
      setSupplierErrors((prevState) => ({
        ...prevState,
        supplier_name: 'Nama supplier wajib diisi.',
      }));
    }

    if (!isValid) {
      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'warning',
        title: 'Oops...',
        text: 'Masih terdapat kolom yang wajib diisi',
        confirmButtonColor: '#7066e0',
      });
    }

    return isValid;
  };

  const onSaveClick = useCallback(async () => {
    const validateSupplierResult = validateAddSupplier(supplier);
    if (!validateSupplierResult) return;

    try {
      handleIsFetching(true);

      const { status, message, data } = !id ?
        await SupplierService.addSupplier(SupplierMapper.mapDomainToAddSupplierBody(supplier)) :
        await SupplierService.updateSupplier({ id: parseInt(id) }, SupplierMapper.mapDomainToUpdateSupplierBody(supplier));

      if (!status) {
        Swal.fire({
          ...SWAL_CONFIG,
          icon: 'error',
          title: 'Oops...',
          text: message,
        });
        return;
      }

      Swal.fire({
        ...SWAL_CONFIG,
        icon: 'success',
        title: `${id ? 'Ubah' : 'Tambah'} Supplier`,
        text: message,
      });

      if (!id) {
        const insertedId = (data as AddSupplierRes).id;
        insertedId && navigate(`/supplier/detail/${insertedId}`);
      } else {
        refetchSupplier && refetchSupplier();
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleIsFetching(false);
      !id && setSupplier(Supplier.create(InitialSupplier));
    }
  }, [id, supplier, refetchSupplier]);

  const onCancelClick = useCallback(() => {
    navigate('/supplier');
  }, []);

  return (
    <div className="px-8 pb-6">
      <div className="flex flex-col gap-y-7 lg:grid grid-cols-2 lg:gap-8">
        <InputMemo
          label={'Nama Supplier'}
          name={'supplier_name'}
          type={'text'}
          placeholder={'Masukkan nama supplier'}
          isRequired
          value={supplier.supplierName}
          handleChange={onInputChange}
          error={supplierErrors?.supplier_name}
        />
        <InputMemo
          label={'NPWP'}
          name={'npwp'}
          type={'text'}
          placeholder={'Masukkan NPWP supplier'}
          value={supplier.npwp}
          handleChange={onInputChange}
        />
        <InputMemo
          label={'Alamat'}
          name={'address'}
          type={'text'}
          placeholder={'Masukkan alamat supplier'}
          value={supplier.address}
          handleChange={onInputChange}
        />
        <InputMemo
          label={'Nomor Telepon'}
          name={'phone_number'}
          type={'text'}
          placeholder={'Masukkan nomor telepon supplier'}
          value={supplier.phoneNumber}
          handleChange={onInputChange}
        />
        {id ? (
          <SwitcherMemo
            label={'Aktif'}
            isRequired
            value={supplier.isActive}
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
      {id ? (
        <div className="flex items-center gap-x-10 mt-7.5 italic text-bodydark2">
          <span>Created at: {supplier.createdAt}</span>
          <span>Updated at: {supplier.updatedAt}</span>
        </div>
      ) : null}
    </div>
  );
};

export const AddEditSupplierFormMemo = React.memo(AddEditSupplierForm);

export default AddEditSupplierForm;
