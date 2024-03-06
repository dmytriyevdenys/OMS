type ShipmentPayload = {
    uuid: string;
    package_type: string;
    document_templates: any[]; 
};

type AddressPayload = {
    city_ref: string;
    area_desc: string;
    city_desc: string;
    warehouse_ref: string;
    warehouse_desc: string;
};

type DeliveryService = {
    id: number;
    name: string;
    source_name: string;
    alias: string;
};

export type TShippingCrm = {
    delivery_service_id: number;
    address_id: number;
    last_history_id: number;
    tracking_code: string;
    tracking_code_send_at: string;
    shipping_status: string;
    shipment_payload: ShipmentPayload;
    address_payload: AddressPayload;
    is_warehouse: boolean;
    shipping_preferred_method: any; 
    shipping_address: any; // Невідомо, який тип має бути shipping_address
    recipient_phone: string;
    recipient_full_name: string;
    shipping_address_country: string;
    shipping_address_country_code: string;
    shipping_address_region: string;
    shipping_address_city: string;
    shipping_address_zip: any; // Невідомо, який тип має бути shipping_address_zip
    shipping_receive_point: string;
    shipping_secondary_line: any; // Невідомо, який тип має бути shipping_secondary_line
    shipping_date: any; // Невідомо, який тип має бути shipping_date
    shipping_date_actual: any; // Невідомо, який тип має бути shipping_date_actual
    shipping_date_actual_has_owner: boolean;
    shipping_price: any; // Невідомо, який тип має бути shipping_price
    was_shipped: boolean;
    created_at: string;
    updated_at: string;
    deleted_at: any; // Невідомо, який тип має бути deleted_at
    full_address: string;
    delivery_service: DeliveryService;
}