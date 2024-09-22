import { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  PDFViewer,
  Document,
  Page,
  View,
  Image,
  Text,
  StyleSheet
} from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import moment from 'moment';

import {
  numericFormat,
  spellRupiahCurrency,
  chunkArray
} from '../../../commons/helpers';;

import { WAREHOUSE_CODE } from '../../../data/transaction/constants';
import { Transaction } from '../../../data/transaction/domain';
import { TransactionMapper } from '../../../data/transaction/mapper';
import { TransactionService } from '../../../data/transaction/service';
import { DTransaction } from '../../../data/dtransaction/domain';

import Spinner from '../../../components/Spinner/Spinner';

const tw = createTw({});

const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
  },
  section: {
    margin: 10,
    padding: 10
  },
  viewer: {
    width: window.innerWidth,
    height: window.innerHeight
  }
});

const SaleInvoiceDocument = () => {
  const { transaction_id } = useParams<{ transaction_id: string }>();
  const navigate = useNavigate();

  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [transaction, setTransaction] = useState<Transaction>();
  const [dtransactions, setDtransactions] = useState<DTransaction[][]>([]);

  const fetchTransaction = async (transactionId: string) => {
    try {
      setIsFetching(true);

      const { status, data } = await TransactionService.getTransaction({ transaction_id: transactionId });
      if (!status || !data) {
        setIsFetching(false);
        navigate('*', { replace: true });

        return;
      }

      const transactionData = TransactionMapper.mapGetTransactionResToDomain(data);
      setTransaction(transactionData);
      setDtransactions(chunkArray(transactionData.dtransactions || [], 10));
    } catch (error) {
      setIsFetching(false);
      navigate('*', { replace: true });
    } finally {
      setIsFetching(false);
    }
  }

  useEffect(() => {
    if (transaction_id) fetchTransaction(transaction_id);
  }, [transaction_id]);

  const totalDiscount = useMemo((): number => (transaction?.dtransactions || []).reduce((acc, item) => {
    return (acc + (item.discount || 0)) * (item.quantity || 0);
  }, 0), [transaction]);

  return (
    <div className="relative w-screen h-screen">
      {isFetching ? (
        <Spinner />
      ) : (
        <PDFViewer style={styles.viewer}>
          <Document>
            <Page
              size={'LEGAL'}
              orientation={'landscape'}
              style={styles.page}
            >
              {dtransactions.map((items, page) => (
                <View key={`sale-invoice-document-page${page}`} style={tw('relative w-full h-full')}>
                  {/* Header */}
                  <View style={tw('absolute top-0 flex flex-col gap-y-3 w-full px-10 pt-10')}>
                    <View style={tw('relative flex flex-row')}>
                      {transaction?.warehouseId === WAREHOUSE_CODE.HUGAN ? (
                        <Text style={tw('text-xl')}>{transaction?.warehouseId}.CO</Text>
                      ) : (
                        <Image
                          src={'/placeholder-image.jpg'}
                          style={{
                            border: '1px solid black',
                            width: '50px',
                            height: '50px',
                          }}
                        />
                      )}
                      <View style={tw('absolute inset-x-0')}>
                        <Text style={tw('text-xl underline mx-auto')}>FAKTUR PENJUALAN</Text>
                      </View>
                    </View>

                    <View style={tw('flex flex-row justify-between')}>
                      <View style={tw('flex flex-row items-start gap-x-2 text-base')}>
                        <Text>Kepada</Text>
                        <Text>:</Text>
                        <View style={tw('flex flex-col')}>
                          <Text style={tw('uppercase')}>{`${transaction?.customer?.customerName} - ${transaction?.customer?.npwp || ''}`}</Text>
                          <Text style={tw('uppercase')}>{transaction?.customer?.address || '-'}</Text>
                        </View>
                      </View>

                      <View style={tw('flex flex-row gap-x-4')}>
                        <View style={tw('flex flex-col text-base')}>
                          <Text>Nomor</Text>
                          <Text>Tanggal</Text>
                        </View>
                        <View style={tw('flex flex-col text-base')}>
                          <Text>: {transaction?.notaId}</Text>
                          <Text>: {moment(transaction?.createdAt).format('D/MM/YY')}</Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Body */}
                  {/* <View style={tw('mt-[130px] px-10')}>
                  <View style={tw('flex flex-row items-center border text-base')}>
                    <Text style={tw('text-center border-r w-[5%]')}>NO</Text>
                    <Text style={tw('text-center border-r w-[35%]')}>NAMA BARANG</Text>
                    <Text style={tw('text-center border-r w-[20%]')}>PECAHAN BARANG</Text>
                    <Text style={tw('text-center border-r w-[10%]')}>QUANTITY</Text>
                    <Text style={tw('text-center border-r w-[10%]')}>HARGA</Text>
                    <Text style={tw('text-center border-r w-[10%]')}>DISC</Text>
                    <Text style={tw('text-center w-[10%]')}>JUMLAH</Text>
                  </View>
                  {(transaction?.dtransactions || []).map((item, idx) => {
                    if (item.isCombined) {
                      return (
                        <>
                          <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                            <Text style={tw('text-center border-r w-[5%]')}>{idx + 1}</Text>
                            <Text style={tw('text-center border-r w-[35%]')}>{item.getProductName()}</Text>
                            <Text style={tw('text-center border-r w-[20%]')}>&nbsp;</Text>
                            <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.quantity || 0)}</Text>
                            <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.price || 0)}</Text>
                            <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.discount || 0)}</Text>
                            <Text style={tw('text-center w-[10%]')}>{numericFormat(item.subTotal || 0)}</Text>
                          </View>
                          {(item.items || []).map(item1 => (
                            <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                              <Text style={tw('text-center border-r w-[5%]')}>&nbsp;</Text>
                              <Text style={tw('text-center border-r w-[35%]')}>&nbsp;</Text>
                              <Text style={tw('text-center border-r w-[20%]')}>{item1.product?.productName}</Text>
                              <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item1.quantity || 0)}</Text>
                              <Text style={tw('text-center w-[10%] border-r')}>&nbsp;</Text>
                              <Text style={tw('text-center w-[10%] border-r')}>&nbsp;</Text>
                              <Text style={tw('text-center w-[10%]')}>&nbsp;</Text>
                            </View>
                          ))}
                        </>
                      );
                    }

                    return (
                      <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                        <Text style={tw('text-center border-r w-[5%]')}>{idx + 1}</Text>
                        <Text style={tw('text-center border-r w-[35%]')}>{item.getProductName()}</Text>
                        <Text style={tw('text-center border-r w-[20%]')}>-</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.quantity || 0)}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.price || 0)}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.discount || 0)}</Text>
                        <Text style={tw('text-center w-[10%]')}>{numericFormat(item.subTotal || 0)}</Text>
                      </View>
                    );
                  })}
                </View> */}

                  {/* Body */}
                  <View style={tw(`${transaction?.warehouseId === WAREHOUSE_CODE.HUGAN ? 'mt-[130px]' : 'mt-[150px]'} px-10`)}>
                    <View style={tw('flex flex-row items-center border text-base')}>
                      <Text style={tw('text-center border-r w-[50%]')}>NAMA BARANG</Text>
                      <Text style={tw('text-center border-r w-[10%]')}>QUANTITY</Text>
                      <Text style={tw('text-center border-r w-[10%]')}>HARGA</Text>
                      <Text style={tw('text-center border-r w-[10%]')}>SUBTOTAL</Text>
                      <Text style={tw('text-center border-r w-[10%]')}>DISC</Text>
                      <Text style={tw('text-center w-[10%]')}>JUMLAH</Text>
                    </View>
                    {items.map((item, idx) => (
                      <View key={`sale-invoice-document-item-${idx}`} style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                        <Text style={tw('text-center border-r w-[50%]')}>{item.getProductName()}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.quantity || 0)}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.price || 0)}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat((item.subTotal || 0) + (item.discount || 0))}</Text>
                        <Text style={tw('text-center w-[10%] border-r')}>{numericFormat(item.discount || 0)}</Text>
                        <Text style={tw('text-center w-[10%]')}>{numericFormat(item.subTotal || 0)}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Footer */}
                  <View style={tw('absolute bottom-0 w-full flex flex-col gap-y-5 mt-10 px-10 pb-10')}>
                    <View style={tw('flex flex-row justify-between items-start border px-1')}>
                      <View style={tw('flex flex-col gap-y-3 text-base py-2')}>
                        <View style={tw('flex flex-row items-center gap-x-1')}>
                          <Text>Terbilang</Text>
                          <Text>:</Text>
                          <Text>{spellRupiahCurrency(Math.floor(transaction?.total || 0))} Rupiah</Text>
                        </View>

                        <View style={tw('flex flex-col gap-y-2')}>
                          <View style={tw('flex flex-row items-start gap-x-1')}>
                            <Text>Rekening</Text>
                            <Text>:</Text>
                            <View style={tw('flex flex-col gap-y-1')}>
                              {transaction?.warehouseId === WAREHOUSE_CODE.HUGAN ? (
                                <>
                                  <Text>509-38-8888-9 a/n Handjaya Andrew Hugan (BCA)</Text>
                                  <Text>6710-77-3333 a/n Filbert (BCA)</Text>
                                </>
                              ) : (
                                <Text>6710-711-117 a/n PT. Kabeh Ragam Ono Indonesia (BCA)</Text>
                              )}
                            </View>
                          </View>
                          {transaction?.ppn ? (
                            <Text>HARGA DIATAS SUDAH TERMASUK PPN 11%</Text>
                          ) : null}
                        </View>
                      </View>

                      <View style={tw('flex flex-row items-center gap-x-2 h-full')}>
                        <View style={tw('flex flex-col gap-y-2 text-base py-2')}>
                          <Text>Jumlah</Text>
                          <Text>Diskon</Text>
                          <Text>Total</Text>
                        </View>
                        <View style={tw('border-r h-full')}></View>
                        <View style={tw('flex flex-col items-center gap-y-2 text-base py-2')}>
                          <Text>{numericFormat(transaction?.subTotal || 0)}</Text>
                          <Text>{numericFormat(totalDiscount)}</Text>
                          <Text>{numericFormat(transaction?.total || 0)}</Text>
                        </View>
                      </View>
                    </View>

                    <View style={tw('flex flex-row items-center gap-x-20 text-base')}>
                      <View style={tw('flex flex-col gap-y-2 w-[65%]')}>
                        <View style={tw('border px-1 py-2')}>
                          <Text style={tw('italic')}>Barang yang telah dibeli tidak dapat dikembalikan kecuali ada perjanjian lebih dulu</Text>
                        </View>
                      </View>
                      {/* <View style={tw('w-[25%]')}>
                      <Text style={tw('text-center')}>Diterima Oleh,</Text>
                      <View style={tw('border border-b mt-24')}></View>
                    </View> */}
                      <View style={tw('w-[25%] ml-auto')}>
                        <Text style={tw('text-center')}>Hormat Kami,</Text>
                        <View style={tw('border border-b mt-24')}></View>
                      </View>
                    </View>
                  </View>
                </View>
              ))}
            </Page>
          </Document>
        </PDFViewer>
      )}
    </div>
  );
};

export default SaleInvoiceDocument;
