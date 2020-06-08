import MeetingRoomInfoStore from './room-resinfo-store'
import LoginStore from './room-login-store'
import RoomResListStore from "./room-book-store";
import ReservationDetailStore from "./reservation-detail-store";
import BusBindStore from "./bus-bind-store";
import TicketListStore from "./ticket-list-store";
import BusListStore from "./bus-list-store";
import BusDispatchStore from "./bus-dispatch-store";
import ProductDetailStore from "./product-detail-store";
import CurrentStore from './current-store';
import LostFindStore from './lost-find-store';
import DataFromStore from './data-from-store';
import GoodsDetailStore from './lost-find-detail-store';


const stores = {};
export default {
  ...stores
}
export const createStoreMap = () => {
  return {
    meetingRoomInfoStore: new MeetingRoomInfoStore(), 
    roomLoginStore: new LoginStore(),
    roomResListStore: new RoomResListStore(),
    reservationDetailStore:new ReservationDetailStore(),
    busBindStore:new BusBindStore(),
    ticketListStore:new TicketListStore(),
    busListStore: new BusListStore(),
    busDispatchStore:new BusDispatchStore(),
    productDetailStore:new ProductDetailStore(),
    currentStore:new CurrentStore(),
    lostFindStore:new LostFindStore(),
    dataFromStore:new DataFromStore(),
    goodsDetailStore:new GoodsDetailStore()
  }
}

