import { BaseProps } from "./BaseProps";
import Event from "../models/Event";
export interface ScheduleEventProps extends BaseProps {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  events: Array<Event>
  setEvents: React.Dispatch<React.SetStateAction<Array<Event>>>;
}
