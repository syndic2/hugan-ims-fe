import { BaseSelect } from '../../commons/common';
import { TransactionMapper } from '../transaction/mapper';
import { GetTransactionSupplierRes } from '../transaction/contracts';
import {
  GetSuppliersItemRes,
  GetSuppliersSelectItemRes,
  GetSupplierRes,
  AddSupplierBody,
  UpdateSupplierBody,
} from './contracts';
import { Supplier } from './domain';

export class SupplierMapper {

  static mapGetSuppliersItemResToDomain(data: GetSuppliersItemRes): Supplier {
    return Supplier.create({
      ...data.id && { id: data.id },
      ...data.supplier_name && { supplier_name: data.supplier_name },
      ...data.npwp && { npwp: data.npwp },
      ...data.address && { address: data.address },
      ...data.phone_number && { phone_number: data.phone_number },
      ...data.is_active && { is_active: data.is_active }
    });
  }

  static mapGetSuppliersSelectItemResToDomain(data: GetSuppliersSelectItemRes): BaseSelect<any> {
    return {
      label: `${data.npwp || '-'} - ${data.supplier_name || '-'}`,
      value: data.id || 0
    };
  }

  static mapGetSupplierResToDomain(data: GetSupplierRes): Supplier {
    return Supplier.create({
      ...this.mapGetSuppliersItemResToDomain(data).props,
      ...(data.created_at && { created_at: data.created_at }),
      ...(data.updated_at && { updated_at: data.updated_at }),
      ...data.transaction && {
        transactions: (data.transaction || []).map(item => TransactionMapper.mapGetProductTransactionsResToDomain(item))
      }
    });
  };

  static mapDomainToAddSupplierBody(data: Supplier): AddSupplierBody {
    return {
      supplier_name: data.supplierName,
      npwp: data.npwp,
      phone_number: data.phoneNumber,
      address: data.address
    };
  }

  static mapDomainToUpdateSupplierBody(data: Supplier): UpdateSupplierBody {
    return {
      ...this.mapDomainToAddSupplierBody(data),
      address: data.address,
      phone_number: data.phoneNumber,
      is_active: data.isActive
    };
  }

  static mapGetTransactionSupplierResToDomain(data: GetTransactionSupplierRes): Supplier {
    return Supplier.create({
      ...data.id && { id: data.id },
      ...data.supplier_name && { supplier_name: data.supplier_name },
      ...data.npwp && { npwp: data.npwp },
      ...data.address && { address: data.address },
      ...data.phone_number && { phone_number: data.phone_number },
      ...data.is_active && { is_active: data.is_active }
    });
  }
}
