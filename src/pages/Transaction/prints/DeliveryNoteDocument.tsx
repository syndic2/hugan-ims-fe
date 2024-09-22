import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet
} from '@react-pdf/renderer';
import { createTw } from 'react-pdf-tailwind';
import moment from 'moment';

import { numericFormat, chunkArray } from '../../../commons/helpers';

import { Product } from '../../../data/product/domain';
import { Customer } from '../../../data/customer/domain';
import { Transaction } from '../../../data/transaction/domain';
import { DTransaction } from '../../../data/dtransaction/domain';

import { DeliveryNoteDataProps } from '../AddDeliveryNoteTransaction';

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
  },
});

const DeliveryNoteDocument = () => {
  const navigate = useNavigate();

  const [deliveryNoteId, setDeliveryNoteId] = useState<string>();
  const [transaction, setTransaction] = useState<Transaction>();
  const [dtransactions, setDtransactions] = useState<DTransaction[][]>([]);

  // const fetchTransaction = async (transactionId: string) => {
  //   try {
  //     setIsFetching(true);

  //     const { status, data } = await TransactionService.getTransaction({ transaction_id: transactionId });
  //     if (!status || !data) {
  //       setIsFetching(false);
  //       navigate('*', { replace: true });

  //       return;
  //     }

  //     setTransaction(TransactionMapper.mapGetTransactionResToDomain(data));
  //   } catch (error) {
  //     setIsFetching(false);
  //     navigate('*', { replace: true });
  //   } finally {
  //     setIsFetching(false);
  //   }
  // }

  const loadDeliveryNote = () => {
    try {
      const data = localStorage.getItem('delivery_note');
      if (data) {
        const { delivery_note_id, transaction } = JSON.parse(data) as DeliveryNoteDataProps;

        setDeliveryNoteId(delivery_note_id);
        if (transaction) {
          const dtransactionsData = (transaction.dtransactions || []).map(item => DTransaction.create({
            ...item.props,
            ...item.props.product && { product: Product.create({ ...item.props.product.props }) }
          }));
          setTransaction(Transaction.create({
            ...transaction,
            ...transaction.customer && { customer: Customer.create({ ...transaction.customer.props }) },
            dtransactions: dtransactionsData
          }));
          setDtransactions(chunkArray(dtransactionsData, 10));
        }
      }
    } catch (error) {
      navigate('*', { replace: true });
    }
  };

  useEffect(() => {
    loadDeliveryNote();
  }, []);

  return (
    <div className="relative w-screen h-screen">
      <PDFViewer style={styles.viewer}>
        <Document>
          <Page
            size={'LEGAL'}
            orientation={'landscape'}
            style={styles.page}
          >
            {dtransactions.map((items, page) => (
              <View key={`delivery-note-document-page${page}`} style={tw('relative w-full h-full')}>
                {/* Header */}
                <View style={tw('absolute top-0 flex flex-col gap-y-3 w-full px-10 pt-10')}>
                  <View style={tw('relative flex flex-row')}>
                    <Text style={tw('text-xl')}>{transaction?.warehouseId}</Text>
                    <View style={tw('absolute inset-x-0')}>
                      <Text style={tw('text-xl underline mx-auto')}>SURAT JALAN</Text>
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
                        <Text>: {deliveryNoteId}</Text>
                        <Text>: {moment(transaction?.createdAt).format('D/MM/YY')}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Body */}
                {/* <View style={tw('mt-[130px] px-10')}>
                <View style={tw('flex flex-row items-center border text-base')}>
                  <Text style={tw('text-center border-r w-[5%]')}>NO</Text>
                  <Text style={tw('text-center border-r w-[50%]')}>NAMA BARANG</Text>
                  <Text style={tw('text-center border-r w-[35%]')}>PECAHAN BARANG</Text>
                  <Text style={tw('text-center w-[10%]')}>QUANTITY</Text>
                </View>
                {(transaction?.dtransactions || []).map((item, idx) => {
                  if (item.isCombined) {
                    return (
                      <>
                        <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                          <Text style={tw('text-center border-r w-[5%]')}>{idx + 1}</Text>
                          <Text style={tw('text-center border-r w-[50%]')}>{item.getProductName()}</Text>
                          <Text style={tw('text-center border-r w-[35%]')}>&nbsp;</Text>
                          <Text style={tw('text-center w-[10%]')}>{numericFormat(item.quantity || 0)}</Text>
                        </View>
                        {(item.items || []).map(item1 => (
                          <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                            <Text style={tw('text-center border-r w-[5%]')}>&nbsp;</Text>
                            <Text style={tw('text-center border-r w-[50%]')}>&nbsp;</Text>
                            <Text style={tw('text-center border-r w-[35%]')}>{item1.product?.productName}</Text>
                            <Text style={tw('text-center w-[10%]')}>{numericFormat(item1.quantity || 0)}</Text>
                          </View>
                        ))}
                      </>
                    );
                  }

                  return (
                    <View style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                      <Text style={tw('text-center border-r w-[5%]')}>{idx + 1}</Text>
                      <Text style={tw('text-center border-r w-[50%]')}>{item.getProductName()}</Text>
                      <Text style={tw('text-center border-r w-[35%]')}>-</Text>
                      <Text style={tw('text-center w-[10%]')}>{numericFormat(item.quantity || 0)}</Text>
                    </View>
                  );
                })}
              </View> */}

                {/* Body */}
                <View style={tw('my-[130px] px-10')}>
                  <View style={tw('flex flex-row items-center border text-base')}>
                    <Text style={tw('text-center border-r w-[10%]')}>QUANTITY</Text>
                    <Text style={tw('text-center w-[90%]')}>NAMA BARANG</Text>
                  </View>
                  {items.map((item, idx) => (
                    <View key={`delivery-note-document-item-${idx}`} style={tw('flex flex-row items-center border-r border-l border-b text-base')}>
                      <Text style={tw('text-center border-r w-[10%]')}>{numericFormat(item.quantity || 0)}</Text>
                      <Text style={tw('text-center w-[90%]')}>{item.getProductName()}</Text>
                    </View>
                  ))}
                </View>

                {/* Footer */}
                <View style={tw('absolute bottom-0 w-full flex flex-col gap-y-3 mt-10 px-10 pb-10')}>
                  <View style={tw('flex flex-col gap-y-1')}>
                    <Text style={tw('text-base')}>Pengiriman:</Text>
                    <Text style={tw('text-base')}>BARANG SUDAH DITERIMA DALAM KONDISI BENAR DAN BAIK</Text>
                  </View>
                  <View style={tw('flex flex-row items-center gap-x-10')}>
                    {/* <View style={tw('w-[25%]')}>
                    <Text style={tw('text-base text-center')}>Penerima,</Text>
                    <View style={tw('border border-b mt-28')}></View>
                  </View>
                  <View style={tw('w-[25%]')}>
                    <Text style={tw('text-base text-center')}>Checker,</Text>
                    <View style={tw('border border-b mt-28')}></View>
                  </View>
                  <View style={tw('w-[25%]')}>
                    <Text style={tw('text-base text-center')}>Gudang,</Text>
                    <View style={tw('border border-b mt-28')}></View>
                  </View>
                  <View style={tw('w-[25%]')}>
                    <Text style={tw('text-lg text-center')}>Supir,</Text>
                    <View style={tw('border border-b mt-28')}></View>
                  </View> */}
                    <View style={tw('w-[50%]')}>
                      <Text style={tw('text-base text-center')}>Penerima,</Text>
                      <View style={tw('border border-b mt-28')}></View>
                    </View>
                    <View style={tw('w-[50%]')}>
                      <Text style={tw('text-base text-center')}>Pengirim,</Text>
                      <View style={tw('border border-b mt-28')}></View>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </Page>
        </Document>
      </PDFViewer>
    </div>
  );
};

export default DeliveryNoteDocument;
