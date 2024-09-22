import { BaseSelect } from '../../commons/common';

import { TransactionMapper } from '../transaction/mapper';

import { GetTransactionCustomerRes } from '../transaction/contracts';
import {
  GetCustomersItemRes,
  GetCustomersSelectItemRes,
  GetCustomerRes,
  AddCustomerBody,
  UpdateCustomerBody
} from './contracts';
import { Customer } from './domain';

export class CustomerMapper {

  static mapGetCustomersItemResToDomain(data: GetCustomersItemRes): Customer {
    return Customer.create({
      ...data.id && { id: data.id },
      ...data.customer_name && { customer_name: data.customer_name },
      ...data.npwp && { npwp: data.npwp },
      ...data.address && { address: data.address },
      ...data.phone_number && { phone_number: data.phone_number },
      ...data.is_active && { is_active: data.is_active }
    });
  }

  static mapGetCustomersSelectItemResToDomain(data: GetCustomersSelectItemRes): BaseSelect<number> {
    return {
      label: `${data.npwp} - ${data.customer_name}` || '-',
      value: data.id || 0
    };
  }

  static mapGetCustomerResToDomain = (data: GetCustomerRes): Customer => {
    return Customer.create({
      ...this.mapGetCustomersItemResToDomain(data).props,
      ...data.created_at && { created_at: data.created_at },
      ...data.updated_at && { updated_at: data.updated_at },
      ...data.transaction && {
        transactions: (data.transaction || []).map(item => TransactionMapper.mapGetCustomerTransactionsResToDomain(item))
      }
    });
  };

  static mapDomainToAddCustomerBody(data: Customer): AddCustomerBody {
    return {
      customer_name: data.customerName,
      npwp: data.npwp,
      phone_number: data.phoneNumber,
      address: data.address
    };
  }

  static mapDomainToUpdateCustomerBody(data: Customer): UpdateCustomerBody {
    return {
      ...this.mapDomainToAddCustomerBody(data),
      address: data.address,
      phone_number: data.phoneNumber,
      is_active: data.isActive
    };
  }

  static mapGetTransactionCustomerRes(data: GetTransactionCustomerRes): Customer {
    return Customer.create({
      ...data.id && { id: data.id },
      ...data.customer_name && { customer_name: data.customer_name },
      ...data.npwp && { npwp: data.npwp },
      ...data.address && { address: data.address },
      ...data.is_active && { is_active: data.is_active }
    })
  }
}
