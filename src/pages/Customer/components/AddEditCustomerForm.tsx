import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from 'react-icons/fa';
import { MdCancel } from 'react-icons/md';
import Swal from 'sweetalert2';

import { SWAL_CONFIG } from '../../../constants';

import { Customer, InitialCustomer } from '../../../data/customer/domain';
import { CustomerMapper } from '../../../data/customer/mapper';
import { CustomerService } from '../../../data/customer/service';
import { AddCustomerRes } from '../../../data/customer/contracts';
import { AddCustomerErrors, UpdateCustomerErrors } from '../../../data/customer/errors';

import { InputMemo } from '../../../components/Input/Input';
import { SwitcherMemo } from '../../../components/Switcher/Switcher';
import { ButtonMemo } from '../../../components/Button/Button';

interface AddEditCustomerFormProps {
  id?: string;
  existCustomer?: Customer;
  handleIsFetching: (isFetch: boolean) => void;
  refetchCustomer?: () => void;
}

const AddEditCustomerForm: React.FC<AddEditCustomerFormProps> = (props: AddEditCustomerFormProps) => {
  const navigate = useNavigate();

  const {
    id,
    existCustomer,
    handleIsFetching,
    refetchCustomer
  } = props;

  const [customer, setCustomer] = useState<Customer>(Customer.create(InitialCustomer));
  const [customerErrors, setCustomerErrors] = useState<AddCustomerErrors | UpdateCustomerErrors>();

  useEffect(() => {
    existCustomer && setCustomer(Customer.create({ ...existCustomer.props }));
  }, [existCustomer]);

  const onInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCustomer((prevState) =>
      Customer.create({
        ...prevState.props,
        [event.target.name]: event.target.value
      }),
    );
    setCustomerErrors((prevState) => ({
      ...prevState,
      [event.target.name]: undefined
    }));
  }, []);

  const onStatusChange = useCallback(() => {
    setCustomer(prevState => Customer.create({
      ...prevState.props,
      is_active: !prevState.isActive
    }));
  }, []);

  const validateAddCustomer = (customer: Customer) => {
    let isValid = true;

    if (!customer.customerName || customer.customerName === '') {
      isValid = false;
      setCustomerErrors((prevState) => ({
        ...prevState,
        customer_name: 'Nama Customer wajib diisi.',
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

  const onSaveClick = useCallback(async (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const validateCustomerResult = validateAddCustomer(customer);
    if (!validateCustomerResult) return;

    try {
      handleIsFetching(true);

      const { status, message, data } = !id ?
        await CustomerService.addCustomer(CustomerMapper.mapDomainToAddCustomerBody(customer)) :
        await CustomerService.updateCustomer({ id: parseInt(id) }, CustomerMapper.mapDomainToUpdateCustomerBody(customer));
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
        title: `${id ? 'Ubah' : 'Tambah'} Customer`,
        text: message
      });

      if (!id) {
        const insertedId = (data as AddCustomerRes).id;
        insertedId && navigate(`/customer/detail/${insertedId}`);
      } else {
        refetchCustomer && refetchCustomer();
      }
    } catch (error) {
      console.error(error);
    } finally {
      handleIsFetching(false);
      !id && setCustomer(Customer.create(InitialCustomer));
    }
  }, [id, customer]);

  const onCancelClick = useCallback(() => {
    navigate('/customer');
  }, []);

  return (
    <form className="px-8 pb-6">
      <div className="flex flex-col gap-y-7 lg:grid grid-cols-2 lg:gap-8">
        <InputMemo
          label={'Nama Customer'}
          name={'customer_name'}
          type={'text'}
          placeholder={'Masukkan nama Customer'}
          isRequired
          value={customer.customerName}
          handleChange={onInputChange}
          error={customerErrors?.customer_name}
        />
        <InputMemo
          label={'NPWP'}
          name={'npwp'}
          type={'text'}
          placeholder={'Masukkan NPWP'}
          value={customer.npwp}
          handleChange={onInputChange}
        />
        <InputMemo
          label={'Alamat'}
          name={'address'}
          type={'text'}
          placeholder={'Masukkan alamat'}
          value={customer.address}
          handleChange={onInputChange}
        />
        <InputMemo
          label={'Nomor Telepon'}
          name={'phone_number'}
          type={'text'}
          placeholder={'Masukkan nomor telepon'}
          value={customer.phoneNumber}
          handleChange={onInputChange}
        />
        {id ? (
          <SwitcherMemo
            label={'Aktif'}
            isRequired
            value={customer.isActive}
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
          <span>Created at: {customer.createdAt}</span>
          <span>Updated at: {customer.updatedAt}</span>
        </div>
      ) : null}
    </form>
  );
};

export const AddEditCustomerFormMemo = React.memo(AddEditCustomerForm);

export default AddEditCustomerForm;
