export const NO_REGION_STATUS = 'none'

/*
* 0 - The shipment has arrived at the warehouse and is awaiting shipment.
* 1 - Cargo on the way
* 2 - The shipment has arrived at its destination
* 3 - Shipment received by customer
* */
export const CARGO_STATUS = {
  CARGO_WAITING_TO_BE_SEND: 0,
  CARGO_ON_THE_WAY: 1,
  CARGO_HAS_ARRIVED_AT_ITS_DESTINATION: 2,
  CARGO_RECEIVED_BY_CUSTOMER: 3
} as const;
