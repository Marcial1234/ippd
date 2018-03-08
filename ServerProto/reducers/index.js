import { combineReducers} from "redux";

import user from "./userReducer";
import mode from "./modeReducer";
import photo from "./photoReducer";
import location from "./locationReducer";

export default combineReducers({
  user,
  mode,
  photo,
  location,
})
