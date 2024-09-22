import { APP_TITLE } from './constants';

// import ECommerce from './pages/Dashboard/ECommerce';

import ListProduct from './pages/Product/ListProduct';
import AddProduct from './pages/Product/AddProduct';
import DetailProduct from './pages/Product/DetailProduct';
import SplitStockProduct from './pages/Product/SplitStockProduct';

import ListSupplier from './pages/Supplier/ListSupplier';
import AddSupplier from './pages/Supplier/AddSupplier';
import DetailSupplier from './pages/Supplier/DetailSupplier';

import ListCustomer from './pages/Customer/ListCustomer';
import AddCustomer from './pages/Customer/AddCustomer';
import DetailCustomer from './pages/Customer/DetailCustomer';

import ListTransaction from './pages/Transaction/ListTransaction';
import AddPurchaseTransaction from './pages/Transaction/AddPurchaseTransaction';
import AddSaleTransaction from './pages/Transaction/AddSaleTransaction';
import DetailTransaction from './pages/Transaction/DetailTransaction';
import AddDeliveryNoteTransaction from './pages/Transaction/AddDeliveryNoteTransaction';

import PurchaseReport from './pages/Report/PurchaseReport';
import SaleReport from './pages/Report/SaleReport';

interface IRoute {
  index?: boolean;
  path?: string;
  title: string;
  element: React.ReactNode;
}

const routes: IRoute[] = [
  // DASHBOARD
  // {
  //   index: true,
  //   title: `${APP_TITLE} | Dashboard`,
  //   path: '/',
  //   element: <Navigate to={'/dashboard'} />
  // },
  // {
  //   title: `${APP_TITLE} | Dashboard`,
  //   path: '/dashboard',
  //   element: <ECommerce />
  // },

  // PRODUCT
  {
    index: true,
    title: `${APP_TITLE} | Daftar Barang`,
    path: '/',
    element: <ListProduct />
  },
  {
    title: `${APP_TITLE} | Daftar Barang`,
    path: '/product',
    element: <ListProduct />
  },
  {
    title: `${APP_TITLE} | Tambah Barang`,
    path: '/product/add',
    element: <AddProduct />
  },
  {
    title: `${APP_TITLE} | Detail Barang`,
    path: '/product/detail/:product_code',
    element: <DetailProduct />
  },
  {
    title: `${APP_TITLE} | Pecah Stok Barang`,
    path: '/product/split-stock',
    element: <SplitStockProduct />
  },

  // SUPPLIER
  {
    title: `${APP_TITLE} | Daftar Supplier`,
    path: '/supplier',
    element: <ListSupplier />
  },
  {
    title: `${APP_TITLE} | Tambah Supplier`,
    path: '/supplier/add',
    element: <AddSupplier />
  },
  {
    title: `${APP_TITLE} | Detail Supplier`,
    path: '/supplier/detail/:id',
    element: <DetailSupplier />
  },

  // CUSTOMER
  {
    title: `${APP_TITLE} | Daftar Customer`,
    path: '/customer',
    element: <ListCustomer />
  },
  {
    title: `${APP_TITLE} | Tambah Customer`,
    path: '/customer/add',
    element: <AddCustomer />
  },
  {
    title: `${APP_TITLE} | Detail Customer`,
    path: '/customer/detail/:id',
    element: <DetailCustomer />
  },

  // TRANSACTION
  {
    title: `${APP_TITLE} | Daftar Transaksi`,
    path: '/transaction',
    element: <ListTransaction />
  },
  {
    title: `${APP_TITLE} | Tambah Transaksi Pembelian`,
    path: '/transaction/add/purchase',
    element: <AddPurchaseTransaction />
  },
  {
    title: `${APP_TITLE} | Tambah Transaksi Penjualan`,
    path: '/transaction/add/sale',
    element: <AddSaleTransaction />
  },
  {
    title: `${APP_TITLE} | Detail Transaksi`,
    path: '/transaction/detail/:transaction_id',
    element: <DetailTransaction />
  },
  {
    title: `${APP_TITLE} | Tambah Surat Jalan`,
    path: '/transaction/delivery-note/add',
    element: <AddDeliveryNoteTransaction />
  },

  // REPORT
  {
    title: `${APP_TITLE} | Laporan Pembelian`,
    path: '/report/purchase',
    element: <PurchaseReport />
  },
  {
    title: `${APP_TITLE} | Laporan Penjualan`,
    path: '/report/sale',
    element: <SaleReport />
  }
];

export default routes;
