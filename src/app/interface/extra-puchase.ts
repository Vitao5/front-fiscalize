export interface ExtraPurchase{
  id: string,
  purchaseName: string,
  purchaseDate: string,
  purchaseTypePayment: string,
  bankName: string,
  purchaseValue: number,
  monthPayment: number,
  listFormatted: Array<{
    purchaseName: string,
    purchaseDate: string,
    purchaseTypePayment: string,
    bankName: string,
    purchaseValue: number
  }>
}
