import { combineReducers} from "redux";

import user from "./userReducer";
import mode from "./modeReducer";
import photo from "./photoReducer";

export default combineReducers({
  user,
  mode,
  photo,
})
