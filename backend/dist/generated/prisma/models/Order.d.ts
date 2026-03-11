import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Order
 *
 */
export type OrderModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderPayload>;
export type AggregateOrder = {
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
export type OrderAvgAggregateOutputType = {
    price: runtime.Decimal | null;
    downloadCount: number | null;
    maxDownloads: number | null;
};
export type OrderSumAggregateOutputType = {
    price: runtime.Decimal | null;
    downloadCount: number | null;
    maxDownloads: number | null;
};
export type OrderMinAggregateOutputType = {
    id: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    guideId: string | null;
    price: runtime.Decimal | null;
    paymentStatus: $Enums.PaymentStatus | null;
    downloadToken: string | null;
    downloadExpiresAt: Date | null;
    downloadCount: number | null;
    maxDownloads: number | null;
    paymentReference: string | null;
    paymentProvider: string | null;
    ipAddress: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrderMaxAggregateOutputType = {
    id: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerPhone: string | null;
    guideId: string | null;
    price: runtime.Decimal | null;
    paymentStatus: $Enums.PaymentStatus | null;
    downloadToken: string | null;
    downloadExpiresAt: Date | null;
    downloadCount: number | null;
    maxDownloads: number | null;
    paymentReference: string | null;
    paymentProvider: string | null;
    ipAddress: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type OrderCountAggregateOutputType = {
    id: number;
    customerName: number;
    customerEmail: number;
    customerPhone: number;
    guideId: number;
    price: number;
    paymentStatus: number;
    downloadToken: number;
    downloadExpiresAt: number;
    downloadCount: number;
    maxDownloads: number;
    paymentReference: number;
    paymentProvider: number;
    ipAddress: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type OrderAvgAggregateInputType = {
    price?: true;
    downloadCount?: true;
    maxDownloads?: true;
};
export type OrderSumAggregateInputType = {
    price?: true;
    downloadCount?: true;
    maxDownloads?: true;
};
export type OrderMinAggregateInputType = {
    id?: true;
    customerName?: true;
    customerEmail?: true;
    customerPhone?: true;
    guideId?: true;
    price?: true;
    paymentStatus?: true;
    downloadToken?: true;
    downloadExpiresAt?: true;
    downloadCount?: true;
    maxDownloads?: true;
    paymentReference?: true;
    paymentProvider?: true;
    ipAddress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrderMaxAggregateInputType = {
    id?: true;
    customerName?: true;
    customerEmail?: true;
    customerPhone?: true;
    guideId?: true;
    price?: true;
    paymentStatus?: true;
    downloadToken?: true;
    downloadExpiresAt?: true;
    downloadCount?: true;
    maxDownloads?: true;
    paymentReference?: true;
    paymentProvider?: true;
    ipAddress?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type OrderCountAggregateInputType = {
    id?: true;
    customerName?: true;
    customerEmail?: true;
    customerPhone?: true;
    guideId?: true;
    price?: true;
    paymentStatus?: true;
    downloadToken?: true;
    downloadExpiresAt?: true;
    downloadCount?: true;
    maxDownloads?: true;
    paymentReference?: true;
    paymentProvider?: true;
    ipAddress?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type OrderAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Order to aggregate.
     */
    where?: Prisma.OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Orders
    **/
    _count?: true | OrderCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: OrderAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: OrderSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: OrderMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: OrderMaxAggregateInputType;
};
export type GetOrderAggregateType<T extends OrderAggregateArgs> = {
    [P in keyof T & keyof AggregateOrder]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrder[P]> : Prisma.GetScalarType<T[P], AggregateOrder[P]>;
};
export type OrderGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderWhereInput;
    orderBy?: Prisma.OrderOrderByWithAggregationInput | Prisma.OrderOrderByWithAggregationInput[];
    by: Prisma.OrderScalarFieldEnum[] | Prisma.OrderScalarFieldEnum;
    having?: Prisma.OrderScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderCountAggregateInputType | true;
    _avg?: OrderAvgAggregateInputType;
    _sum?: OrderSumAggregateInputType;
    _min?: OrderMinAggregateInputType;
    _max?: OrderMaxAggregateInputType;
};
export type OrderGroupByOutputType = {
    id: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string | null;
    guideId: string;
    price: runtime.Decimal;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date;
    downloadCount: number;
    maxDownloads: number;
    paymentReference: string | null;
    paymentProvider: string | null;
    ipAddress: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: OrderCountAggregateOutputType | null;
    _avg: OrderAvgAggregateOutputType | null;
    _sum: OrderSumAggregateOutputType | null;
    _min: OrderMinAggregateOutputType | null;
    _max: OrderMaxAggregateOutputType | null;
};
type GetOrderGroupByPayload<T extends OrderGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderGroupByOutputType[P]>;
}>>;
export type OrderWhereInput = {
    AND?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    OR?: Prisma.OrderWhereInput[];
    NOT?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    id?: Prisma.StringFilter<"Order"> | string;
    customerName?: Prisma.StringFilter<"Order"> | string;
    customerEmail?: Prisma.StringFilter<"Order"> | string;
    customerPhone?: Prisma.StringNullableFilter<"Order"> | string | null;
    guideId?: Prisma.StringFilter<"Order"> | string;
    price?: Prisma.DecimalFilter<"Order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFilter<"Order"> | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFilter<"Order"> | string;
    downloadExpiresAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    downloadCount?: Prisma.IntFilter<"Order"> | number;
    maxDownloads?: Prisma.IntFilter<"Order"> | number;
    paymentReference?: Prisma.StringNullableFilter<"Order"> | string | null;
    paymentProvider?: Prisma.StringNullableFilter<"Order"> | string | null;
    ipAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    guide?: Prisma.XOR<Prisma.GuideScalarRelationFilter, Prisma.GuideWhereInput>;
};
export type OrderOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    customerEmail?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    downloadToken?: Prisma.SortOrder;
    downloadExpiresAt?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
    paymentReference?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentProvider?: Prisma.SortOrderInput | Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    guide?: Prisma.GuideOrderByWithRelationInput;
};
export type OrderWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    downloadToken?: string;
    AND?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    OR?: Prisma.OrderWhereInput[];
    NOT?: Prisma.OrderWhereInput | Prisma.OrderWhereInput[];
    customerName?: Prisma.StringFilter<"Order"> | string;
    customerEmail?: Prisma.StringFilter<"Order"> | string;
    customerPhone?: Prisma.StringNullableFilter<"Order"> | string | null;
    guideId?: Prisma.StringFilter<"Order"> | string;
    price?: Prisma.DecimalFilter<"Order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFilter<"Order"> | $Enums.PaymentStatus;
    downloadExpiresAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    downloadCount?: Prisma.IntFilter<"Order"> | number;
    maxDownloads?: Prisma.IntFilter<"Order"> | number;
    paymentReference?: Prisma.StringNullableFilter<"Order"> | string | null;
    paymentProvider?: Prisma.StringNullableFilter<"Order"> | string | null;
    ipAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    guide?: Prisma.XOR<Prisma.GuideScalarRelationFilter, Prisma.GuideWhereInput>;
}, "id" | "downloadToken">;
export type OrderOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    customerEmail?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrderInput | Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    downloadToken?: Prisma.SortOrder;
    downloadExpiresAt?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
    paymentReference?: Prisma.SortOrderInput | Prisma.SortOrder;
    paymentProvider?: Prisma.SortOrderInput | Prisma.SortOrder;
    ipAddress?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.OrderCountOrderByAggregateInput;
    _avg?: Prisma.OrderAvgOrderByAggregateInput;
    _max?: Prisma.OrderMaxOrderByAggregateInput;
    _min?: Prisma.OrderMinOrderByAggregateInput;
    _sum?: Prisma.OrderSumOrderByAggregateInput;
};
export type OrderScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderScalarWhereWithAggregatesInput | Prisma.OrderScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderScalarWhereWithAggregatesInput | Prisma.OrderScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    customerName?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    customerEmail?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    customerPhone?: Prisma.StringNullableWithAggregatesFilter<"Order"> | string | null;
    guideId?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    price?: Prisma.DecimalWithAggregatesFilter<"Order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusWithAggregatesFilter<"Order"> | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringWithAggregatesFilter<"Order"> | string;
    downloadExpiresAt?: Prisma.DateTimeWithAggregatesFilter<"Order"> | Date | string;
    downloadCount?: Prisma.IntWithAggregatesFilter<"Order"> | number;
    maxDownloads?: Prisma.IntWithAggregatesFilter<"Order"> | number;
    paymentReference?: Prisma.StringNullableWithAggregatesFilter<"Order"> | string | null;
    paymentProvider?: Prisma.StringNullableWithAggregatesFilter<"Order"> | string | null;
    ipAddress?: Prisma.StringNullableWithAggregatesFilter<"Order"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Order"> | Date | string;
};
export type OrderCreateInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    guide: Prisma.GuideCreateNestedOneWithoutOrdersInput;
};
export type OrderUncheckedCreateInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    guideId: string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    guide?: Prisma.GuideUpdateOneRequiredWithoutOrdersNestedInput;
};
export type OrderUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    guideId?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderCreateManyInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    guideId: string;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    guideId?: Prisma.StringFieldUpdateOperationsInput | string;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderListRelationFilter = {
    every?: Prisma.OrderWhereInput;
    some?: Prisma.OrderWhereInput;
    none?: Prisma.OrderWhereInput;
};
export type OrderOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    customerEmail?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    downloadToken?: Prisma.SortOrder;
    downloadExpiresAt?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
    paymentReference?: Prisma.SortOrder;
    paymentProvider?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderAvgOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
};
export type OrderMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    customerEmail?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    downloadToken?: Prisma.SortOrder;
    downloadExpiresAt?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
    paymentReference?: Prisma.SortOrder;
    paymentProvider?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    customerName?: Prisma.SortOrder;
    customerEmail?: Prisma.SortOrder;
    customerPhone?: Prisma.SortOrder;
    guideId?: Prisma.SortOrder;
    price?: Prisma.SortOrder;
    paymentStatus?: Prisma.SortOrder;
    downloadToken?: Prisma.SortOrder;
    downloadExpiresAt?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
    paymentReference?: Prisma.SortOrder;
    paymentProvider?: Prisma.SortOrder;
    ipAddress?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type OrderSumOrderByAggregateInput = {
    price?: Prisma.SortOrder;
    downloadCount?: Prisma.SortOrder;
    maxDownloads?: Prisma.SortOrder;
};
export type OrderCreateNestedManyWithoutGuideInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput> | Prisma.OrderCreateWithoutGuideInput[] | Prisma.OrderUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutGuideInput | Prisma.OrderCreateOrConnectWithoutGuideInput[];
    createMany?: Prisma.OrderCreateManyGuideInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUncheckedCreateNestedManyWithoutGuideInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput> | Prisma.OrderCreateWithoutGuideInput[] | Prisma.OrderUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutGuideInput | Prisma.OrderCreateOrConnectWithoutGuideInput[];
    createMany?: Prisma.OrderCreateManyGuideInputEnvelope;
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
};
export type OrderUpdateManyWithoutGuideNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput> | Prisma.OrderCreateWithoutGuideInput[] | Prisma.OrderUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutGuideInput | Prisma.OrderCreateOrConnectWithoutGuideInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutGuideInput | Prisma.OrderUpsertWithWhereUniqueWithoutGuideInput[];
    createMany?: Prisma.OrderCreateManyGuideInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutGuideInput | Prisma.OrderUpdateWithWhereUniqueWithoutGuideInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutGuideInput | Prisma.OrderUpdateManyWithWhereWithoutGuideInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type OrderUncheckedUpdateManyWithoutGuideNestedInput = {
    create?: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput> | Prisma.OrderCreateWithoutGuideInput[] | Prisma.OrderUncheckedCreateWithoutGuideInput[];
    connectOrCreate?: Prisma.OrderCreateOrConnectWithoutGuideInput | Prisma.OrderCreateOrConnectWithoutGuideInput[];
    upsert?: Prisma.OrderUpsertWithWhereUniqueWithoutGuideInput | Prisma.OrderUpsertWithWhereUniqueWithoutGuideInput[];
    createMany?: Prisma.OrderCreateManyGuideInputEnvelope;
    set?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    disconnect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    delete?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    connect?: Prisma.OrderWhereUniqueInput | Prisma.OrderWhereUniqueInput[];
    update?: Prisma.OrderUpdateWithWhereUniqueWithoutGuideInput | Prisma.OrderUpdateWithWhereUniqueWithoutGuideInput[];
    updateMany?: Prisma.OrderUpdateManyWithWhereWithoutGuideInput | Prisma.OrderUpdateManyWithWhereWithoutGuideInput[];
    deleteMany?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
};
export type EnumPaymentStatusFieldUpdateOperationsInput = {
    set?: $Enums.PaymentStatus;
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type OrderCreateWithoutGuideInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUncheckedCreateWithoutGuideInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderCreateOrConnectWithoutGuideInput = {
    where: Prisma.OrderWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput>;
};
export type OrderCreateManyGuideInputEnvelope = {
    data: Prisma.OrderCreateManyGuideInput | Prisma.OrderCreateManyGuideInput[];
    skipDuplicates?: boolean;
};
export type OrderUpsertWithWhereUniqueWithoutGuideInput = {
    where: Prisma.OrderWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderUpdateWithoutGuideInput, Prisma.OrderUncheckedUpdateWithoutGuideInput>;
    create: Prisma.XOR<Prisma.OrderCreateWithoutGuideInput, Prisma.OrderUncheckedCreateWithoutGuideInput>;
};
export type OrderUpdateWithWhereUniqueWithoutGuideInput = {
    where: Prisma.OrderWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderUpdateWithoutGuideInput, Prisma.OrderUncheckedUpdateWithoutGuideInput>;
};
export type OrderUpdateManyWithWhereWithoutGuideInput = {
    where: Prisma.OrderScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyWithoutGuideInput>;
};
export type OrderScalarWhereInput = {
    AND?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
    OR?: Prisma.OrderScalarWhereInput[];
    NOT?: Prisma.OrderScalarWhereInput | Prisma.OrderScalarWhereInput[];
    id?: Prisma.StringFilter<"Order"> | string;
    customerName?: Prisma.StringFilter<"Order"> | string;
    customerEmail?: Prisma.StringFilter<"Order"> | string;
    customerPhone?: Prisma.StringNullableFilter<"Order"> | string | null;
    guideId?: Prisma.StringFilter<"Order"> | string;
    price?: Prisma.DecimalFilter<"Order"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFilter<"Order"> | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFilter<"Order"> | string;
    downloadExpiresAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    downloadCount?: Prisma.IntFilter<"Order"> | number;
    maxDownloads?: Prisma.IntFilter<"Order"> | number;
    paymentReference?: Prisma.StringNullableFilter<"Order"> | string | null;
    paymentProvider?: Prisma.StringNullableFilter<"Order"> | string | null;
    ipAddress?: Prisma.StringNullableFilter<"Order"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Order"> | Date | string;
};
export type OrderCreateManyGuideInput = {
    id?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string | null;
    price: runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus: $Enums.PaymentStatus;
    downloadToken: string;
    downloadExpiresAt: Date | string;
    downloadCount?: number;
    maxDownloads?: number;
    paymentReference?: string | null;
    paymentProvider?: string | null;
    ipAddress?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type OrderUpdateWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderUncheckedUpdateWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderUncheckedUpdateManyWithoutGuideInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    customerName?: Prisma.StringFieldUpdateOperationsInput | string;
    customerEmail?: Prisma.StringFieldUpdateOperationsInput | string;
    customerPhone?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    price?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    paymentStatus?: Prisma.EnumPaymentStatusFieldUpdateOperationsInput | $Enums.PaymentStatus;
    downloadToken?: Prisma.StringFieldUpdateOperationsInput | string;
    downloadExpiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    downloadCount?: Prisma.IntFieldUpdateOperationsInput | number;
    maxDownloads?: Prisma.IntFieldUpdateOperationsInput | number;
    paymentReference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    paymentProvider?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    ipAddress?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OrderSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    guideId?: boolean;
    price?: boolean;
    paymentStatus?: boolean;
    downloadToken?: boolean;
    downloadExpiresAt?: boolean;
    downloadCount?: boolean;
    maxDownloads?: boolean;
    paymentReference?: boolean;
    paymentProvider?: boolean;
    ipAddress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    guideId?: boolean;
    price?: boolean;
    paymentStatus?: boolean;
    downloadToken?: boolean;
    downloadExpiresAt?: boolean;
    downloadCount?: boolean;
    maxDownloads?: boolean;
    paymentReference?: boolean;
    paymentProvider?: boolean;
    ipAddress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    guideId?: boolean;
    price?: boolean;
    paymentStatus?: boolean;
    downloadToken?: boolean;
    downloadExpiresAt?: boolean;
    downloadCount?: boolean;
    maxDownloads?: boolean;
    paymentReference?: boolean;
    paymentProvider?: boolean;
    ipAddress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["order"]>;
export type OrderSelectScalar = {
    id?: boolean;
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    guideId?: boolean;
    price?: boolean;
    paymentStatus?: boolean;
    downloadToken?: boolean;
    downloadExpiresAt?: boolean;
    downloadCount?: boolean;
    maxDownloads?: boolean;
    paymentReference?: boolean;
    paymentProvider?: boolean;
    ipAddress?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type OrderOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "customerName" | "customerEmail" | "customerPhone" | "guideId" | "price" | "paymentStatus" | "downloadToken" | "downloadExpiresAt" | "downloadCount" | "maxDownloads" | "paymentReference" | "paymentProvider" | "ipAddress" | "createdAt" | "updatedAt", ExtArgs["result"]["order"]>;
export type OrderInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
};
export type OrderIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
};
export type OrderIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    guide?: boolean | Prisma.GuideDefaultArgs<ExtArgs>;
};
export type $OrderPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Order";
    objects: {
        guide: Prisma.$GuidePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        customerName: string;
        customerEmail: string;
        customerPhone: string | null;
        guideId: string;
        price: runtime.Decimal;
        paymentStatus: $Enums.PaymentStatus;
        downloadToken: string;
        downloadExpiresAt: Date;
        downloadCount: number;
        maxDownloads: number;
        paymentReference: string | null;
        paymentProvider: string | null;
        ipAddress: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["order"]>;
    composites: {};
};
export type OrderGetPayload<S extends boolean | null | undefined | OrderDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderPayload, S>;
export type OrderCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderCountAggregateInputType | true;
};
export interface OrderDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Order'];
        meta: {
            name: 'Order';
        };
    };
    /**
     * Find zero or one Order that matches the filter.
     * @param {OrderFindUniqueArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OrderFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Order that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OrderFindUniqueOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OrderFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OrderFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Order that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindFirstOrThrowArgs} args - Arguments to find a Order
     * @example
     * // Get one Order
     * const order = await prisma.order.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OrderFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Orders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Orders
     * const orders = await prisma.order.findMany()
     *
     * // Get first 10 Orders
     * const orders = await prisma.order.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const orderWithIdOnly = await prisma.order.findMany({ select: { id: true } })
     *
     */
    findMany<T extends OrderFindManyArgs>(args?: Prisma.SelectSubset<T, OrderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Order.
     * @param {OrderCreateArgs} args - Arguments to create a Order.
     * @example
     * // Create one Order
     * const Order = await prisma.order.create({
     *   data: {
     *     // ... data to create a Order
     *   }
     * })
     *
     */
    create<T extends OrderCreateArgs>(args: Prisma.SelectSubset<T, OrderCreateArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Orders.
     * @param {OrderCreateManyArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends OrderCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Orders and returns the data saved in the database.
     * @param {OrderCreateManyAndReturnArgs} args - Arguments to create many Orders.
     * @example
     * // Create many Orders
     * const order = await prisma.order.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends OrderCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Order.
     * @param {OrderDeleteArgs} args - Arguments to delete one Order.
     * @example
     * // Delete one Order
     * const Order = await prisma.order.delete({
     *   where: {
     *     // ... filter to delete one Order
     *   }
     * })
     *
     */
    delete<T extends OrderDeleteArgs>(args: Prisma.SelectSubset<T, OrderDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Order.
     * @param {OrderUpdateArgs} args - Arguments to update one Order.
     * @example
     * // Update one Order
     * const order = await prisma.order.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends OrderUpdateArgs>(args: Prisma.SelectSubset<T, OrderUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Orders.
     * @param {OrderDeleteManyArgs} args - Arguments to filter Orders to delete.
     * @example
     * // Delete a few Orders
     * const { count } = await prisma.order.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends OrderDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends OrderUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Orders and returns the data updated in the database.
     * @param {OrderUpdateManyAndReturnArgs} args - Arguments to update many Orders.
     * @example
     * // Update many Orders
     * const order = await prisma.order.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Orders and only return the `id`
     * const orderWithIdOnly = await prisma.order.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    updateManyAndReturn<T extends OrderUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Order.
     * @param {OrderUpsertArgs} args - Arguments to update or create a Order.
     * @example
     * // Update or create a Order
     * const order = await prisma.order.upsert({
     *   create: {
     *     // ... data to create a Order
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Order we want to update
     *   }
     * })
     */
    upsert<T extends OrderUpsertArgs>(args: Prisma.SelectSubset<T, OrderUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderClient<runtime.Types.Result.GetResult<Prisma.$OrderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Orders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderCountArgs} args - Arguments to filter Orders to count.
     * @example
     * // Count the number of Orders
     * const count = await prisma.order.count({
     *   where: {
     *     // ... the filter for the Orders we want to count
     *   }
     * })
    **/
    count<T extends OrderCountArgs>(args?: Prisma.Subset<T, OrderCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends OrderAggregateArgs>(args: Prisma.Subset<T, OrderAggregateArgs>): Prisma.PrismaPromise<GetOrderAggregateType<T>>;
    /**
     * Group by Order.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OrderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     *
    **/
    groupBy<T extends OrderGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Order model
     */
    readonly fields: OrderFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Order.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__OrderClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    guide<T extends Prisma.GuideDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.GuideDefaultArgs<ExtArgs>>): Prisma.Prisma__GuideClient<runtime.Types.Result.GetResult<Prisma.$GuidePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the Order model
 */
export interface OrderFieldRefs {
    readonly id: Prisma.FieldRef<"Order", 'String'>;
    readonly customerName: Prisma.FieldRef<"Order", 'String'>;
    readonly customerEmail: Prisma.FieldRef<"Order", 'String'>;
    readonly customerPhone: Prisma.FieldRef<"Order", 'String'>;
    readonly guideId: Prisma.FieldRef<"Order", 'String'>;
    readonly price: Prisma.FieldRef<"Order", 'Decimal'>;
    readonly paymentStatus: Prisma.FieldRef<"Order", 'PaymentStatus'>;
    readonly downloadToken: Prisma.FieldRef<"Order", 'String'>;
    readonly downloadExpiresAt: Prisma.FieldRef<"Order", 'DateTime'>;
    readonly downloadCount: Prisma.FieldRef<"Order", 'Int'>;
    readonly maxDownloads: Prisma.FieldRef<"Order", 'Int'>;
    readonly paymentReference: Prisma.FieldRef<"Order", 'String'>;
    readonly paymentProvider: Prisma.FieldRef<"Order", 'String'>;
    readonly ipAddress: Prisma.FieldRef<"Order", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Order", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Order", 'DateTime'>;
}
/**
 * Order findUnique
 */
export type OrderFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where: Prisma.OrderWhereUniqueInput;
};
/**
 * Order findUniqueOrThrow
 */
export type OrderFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where: Prisma.OrderWhereUniqueInput;
};
/**
 * Order findFirst
 */
export type OrderFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where?: Prisma.OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Orders.
     */
    cursor?: Prisma.OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Orders.
     */
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * Order findFirstOrThrow
 */
export type OrderFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Order to fetch.
     */
    where?: Prisma.OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Orders.
     */
    cursor?: Prisma.OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Orders.
     */
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * Order findMany
 */
export type OrderFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter, which Orders to fetch.
     */
    where?: Prisma.OrderWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Orders to fetch.
     */
    orderBy?: Prisma.OrderOrderByWithRelationInput | Prisma.OrderOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Orders.
     */
    cursor?: Prisma.OrderWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Orders from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Orders.
     */
    skip?: number;
    distinct?: Prisma.OrderScalarFieldEnum | Prisma.OrderScalarFieldEnum[];
};
/**
 * Order create
 */
export type OrderCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * The data needed to create a Order.
     */
    data: Prisma.XOR<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput>;
};
/**
 * Order createMany
 */
export type OrderCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Orders.
     */
    data: Prisma.OrderCreateManyInput | Prisma.OrderCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Order createManyAndReturn
 */
export type OrderCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * The data used to create many Orders.
     */
    data: Prisma.OrderCreateManyInput | Prisma.OrderCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Order update
 */
export type OrderUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * The data needed to update a Order.
     */
    data: Prisma.XOR<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput>;
    /**
     * Choose, which Order to update.
     */
    where: Prisma.OrderWhereUniqueInput;
};
/**
 * Order updateMany
 */
export type OrderUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Orders.
     */
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyInput>;
    /**
     * Filter which Orders to update
     */
    where?: Prisma.OrderWhereInput;
    /**
     * Limit how many Orders to update.
     */
    limit?: number;
};
/**
 * Order updateManyAndReturn
 */
export type OrderUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * The data used to update Orders.
     */
    data: Prisma.XOR<Prisma.OrderUpdateManyMutationInput, Prisma.OrderUncheckedUpdateManyInput>;
    /**
     * Filter which Orders to update
     */
    where?: Prisma.OrderWhereInput;
    /**
     * Limit how many Orders to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Order upsert
 */
export type OrderUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * The filter to search for the Order to update in case it exists.
     */
    where: Prisma.OrderWhereUniqueInput;
    /**
     * In case the Order found by the `where` argument doesn't exist, create a new Order with this data.
     */
    create: Prisma.XOR<Prisma.OrderCreateInput, Prisma.OrderUncheckedCreateInput>;
    /**
     * In case the Order was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.OrderUpdateInput, Prisma.OrderUncheckedUpdateInput>;
};
/**
 * Order delete
 */
export type OrderDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
    /**
     * Filter which Order to delete.
     */
    where: Prisma.OrderWhereUniqueInput;
};
/**
 * Order deleteMany
 */
export type OrderDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Orders to delete
     */
    where?: Prisma.OrderWhereInput;
    /**
     * Limit how many Orders to delete.
     */
    limit?: number;
};
/**
 * Order without action
 */
export type OrderDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Order
     */
    select?: Prisma.OrderSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Order
     */
    omit?: Prisma.OrderOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.OrderInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Order.d.ts.map